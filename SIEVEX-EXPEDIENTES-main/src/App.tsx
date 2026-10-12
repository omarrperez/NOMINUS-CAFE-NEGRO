import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';

import { DatosEmpresaImportadora, ExpedienteOperacion } from './types';
import { DATOS_EMPRESA_DEFAULT, EXPEDIENTES_INICIALES } from './data/initialData';
import { EXPEDIENTES_PERSONAS_NATURALES } from './data/realBankData';
import { Navbar, ActiveTab } from './components/Navbar';
import { ControlMaestroView } from './components/ControlMaestroView';
import { ExpedientesView } from './components/ExpedientesView';
import { RastroEfectivoView } from './components/RastroEfectivoView';
import { ContabilidadView } from './components/ContabilidadView';
import { DocumentosLegalesView } from './components/DocumentosLegalesView';
import { BaseDeDatosPanel } from './components/BaseDeDatosPanel';
import { NormativaView } from './components/NormativaView';
import { ExpedienteDetailModal } from './components/ExpedienteDetailModal';
import { CompanyConfigModal } from './components/CompanyConfigModal';
import { CsvImportModal } from './components/CsvImportModal';

import {
  db,
  saveExpedienteToFirestore,
  deleteExpedienteFromFirestore,
  clearAllExpedientesFromFirestore,
  saveEmpresaToFirestore,
  logAuditoria,
  testConnection
} from './services/firebase';

export const isSimulatedRecord = (data: Partial<ExpedienteOperacion> | any): boolean => {
  if (!data) return false;
  const nombre = (data.cliente?.nombre || '').toLowerCase().trim();
  const cedula = (data.cliente?.cedula || '').toLowerCase().trim();
  const id = (data.id || '').toLowerCase();

  // Filtrado de nombres simulados reportados por el usuario y de prueba
  if (nombre.includes('maria elena valera') || (nombre.includes('maria elena') && !nombre.includes('blanca elena'))) return true;
  if (nombre.includes('maría elena valera') || (nombre.includes('maría elena') && !nombre.includes('blanca elena'))) return true;
  if (
    nombre.includes('roberto antonio') ||
    nombre.includes('gomez rangel') ||
    nombre.includes('gómez rangel') ||
    (nombre.includes('roberto') && (nombre.includes('gomez') || nombre.includes('gómez')))
  ) {
    return true;
  }
  if (nombre.includes('juan jose perez') || nombre.includes('juan josé pérez') || nombre.includes('juan jose pérez')) {
    return true;
  }
  if (nombre.includes('persona natural') || nombre.startsWith('persona natural')) {
    return true;
  }

  // Cédulas de demostración o IDs de simulación
  if (cedula === 'v-12.345.678' || cedula === '12345678' || cedula.startsWith('v-10.000.') || cedula.includes('v-100000')) return true;
  if (id.includes('demo') || id.includes('mock') || id.includes('simulado')) return true;

  return false;
};

const STORAGE_EXPEDIENTES = 'sievex_expedientes_ve_v3';
const STORAGE_EMPRESA = 'sievex_empresa_ve_v2';

export default function App() {
  const [expedientes, setExpedientes] = useState<ExpedienteOperacion[]>(() => {
    try {
      const isCleaned = localStorage.getItem('sievex_user_explicitly_cleared');
      if (isCleaned) return [];

      // Purgar caché v1 de localStorage que pudiera contener nombres simulados
      localStorage.removeItem('sievex_expedientes_ve_v1');
      localStorage.removeItem('sievex_expedientes_ve_v2');

      const saved = localStorage.getItem(STORAGE_EXPEDIENTES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtrados = parsed.filter((e: ExpedienteOperacion) => !isSimulatedRecord(e));
          if (filtrados.length > 0) return filtrados;
        }
      }
      return EXPEDIENTES_PERSONAS_NATURALES;
    } catch {
      return EXPEDIENTES_PERSONAS_NATURALES;
    }
  });

  const [empresa, setEmpresa] = useState<DatosEmpresaImportadora>(() => {
    try {
      // Purgar caché v1 de empresa con datos de prueba
      localStorage.removeItem('sievex_empresa_ve_v1');
      const saved = localStorage.getItem(STORAGE_EMPRESA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.rif === 'J-50145638-0' && parsed?.razonSocial === 'AGRICOLA ONI, C.A.') {
          return parsed;
        }
      }
      return DATOS_EMPRESA_DEFAULT;
    } catch {
      return DATOS_EMPRESA_DEFAULT;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('control-maestro');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedExpediente, setSelectedExpediente] = useState<ExpedienteOperacion | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);

  // Sincronización en tiempo real con Firestore Cloud Database
  useEffect(() => {
    testConnection();

    // 1. Escuchar colección de expedientes
    const unsubExpedientes = onSnapshot(
      collection(db, 'expedientes'),
      async (snapshot) => {
        // Purgar de forma proactiva en cloud registros simulados (María Elena Valera, Roberto Antonio Gómez Rangel, etc.)
        if (!snapshot.empty) {
          const mockDocs = snapshot.docs.filter((d) => {
            const data = d.data() as ExpedienteOperacion;
            return isSimulatedRecord(data);
          });
          if (mockDocs.length > 0) {
            console.log(`Purgando ${mockDocs.length} documentos simulados en Firestore`);
            for (const md of mockDocs) {
              await deleteExpedienteFromFirestore(md.id);
            }
            await logAuditoria(
              'Depuración de Datos Simulados',
              `Se eliminaron ${mockDocs.length} registros simulados (incluyendo María Elena Valera / Roberto Antonio Gómez Rangel) para preservar únicamente datos reales del CSV.`,
              'Sistema'
            );
          }
        }

        if (!snapshot.empty) {
          const cloudList: ExpedienteOperacion[] = [];
          for (const d of snapshot.docs) {
            let data = d.data() as ExpedienteOperacion;
            if (!isSimulatedRecord(data)) {
              // Verificar si el documento Firestore requiere actualización con el nuevo mapeo de nombres de cédula
              const realMatch = EXPEDIENTES_PERSONAS_NATURALES.find(
                (r) => r.cliente.cedula === data.cliente?.cedula || r.id === data.id
              );
              if (realMatch && realMatch.cliente.nombre !== data.cliente?.nombre) {
                console.log(`Actualizando en Cloud documento ${data.id} a nuevo nombre: ${realMatch.cliente.nombre}`);
                data = { ...data, cliente: { ...data.cliente, ...realMatch.cliente }, observaciones: realMatch.observaciones };
                await saveExpedienteToFirestore(data);
              }
              cloudList.push(data);
            }
          }
          if (cloudList.length > 0) {
            cloudList.sort((a, b) => a.numeroExpediente.localeCompare(b.numeroExpediente));
            setExpedientes(cloudList);
            try {
              localStorage.setItem(STORAGE_EXPEDIENTES, JSON.stringify(cloudList));
            } catch {}
          } else {
            // Si la base quedó vacía tras purgar simulados y no fue limpiada por el usuario, sembrar los 15 reales del CSV
            const userCleared = localStorage.getItem('sievex_user_explicitly_cleared');
            if (!userCleared) {
              for (const op of EXPEDIENTES_PERSONAS_NATURALES) {
                await saveExpedienteToFirestore(op);
              }
            } else {
              setExpedientes([]);
            }
          }
        } else {
          // Si Firestore está vacío y el usuario no lo limpió explícitamente, persistir los 15 expedientes reales del CSV
          const userCleared = localStorage.getItem('sievex_user_explicitly_cleared');
          if (!userCleared) {
            for (const op of EXPEDIENTES_PERSONAS_NATURALES) {
              await saveExpedienteToFirestore(op);
            }
          } else {
            setExpedientes([]);
          }
        }
      },
      (error) => {
        console.warn('Error en listener de Firestore expedientes:', error);
      }
    );

    // 2. Escuchar documento de empresa
    const unsubEmpresa = onSnapshot(
      doc(db, 'empresa', 'config'),
      async (docSnap) => {
        if (docSnap.exists()) {
          const cloudEmpresa = docSnap.data() as DatosEmpresaImportadora;
          if (cloudEmpresa.rif !== 'J-50145638-0' || cloudEmpresa.razonSocial !== 'AGRICOLA ONI, C.A.') {
            await saveEmpresaToFirestore(DATOS_EMPRESA_DEFAULT);
            setEmpresa(DATOS_EMPRESA_DEFAULT);
            try {
              localStorage.setItem(STORAGE_EMPRESA, JSON.stringify(DATOS_EMPRESA_DEFAULT));
            } catch {}
          } else {
            setEmpresa(cloudEmpresa);
            try {
              localStorage.setItem(STORAGE_EMPRESA, JSON.stringify(cloudEmpresa));
            } catch {}
          }
        } else {
          // Sembrar empresa
          await saveEmpresaToFirestore(DATOS_EMPRESA_DEFAULT);
          setEmpresa(DATOS_EMPRESA_DEFAULT);
          try {
            localStorage.setItem(STORAGE_EMPRESA, JSON.stringify(DATOS_EMPRESA_DEFAULT));
          } catch {}
        }
      },
      (error) => {
        console.warn('Error en listener de Firestore empresa:', error);
      }
    );

    return () => {
      unsubExpedientes();
      unsubEmpresa();
    };
  }, []);

  // Crear un nuevo expediente desde cero con número secuencial
  const handleNewExpediente = () => {
    const year = new Date().getFullYear();
    const nextSeq = expedientes.length + 1;
    const nuevoNum = `${year}-${String(nextSeq).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const nuevo: ExpedienteOperacion = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
      numeroExpediente: nuevoNum,
      fechaContrato: today,
      estado: 'En proceso',
      cliente: {
        nombre: '',
        cedula: 'V-',
        rif: 'V-',
        fechaNacimiento: '1985-01-01',
        lugarNacimiento: 'Caracas',
        estadoCivil: 'Soltero(a)',
        nacionalidad: 'Venezolana',
        direccionHabitacion: '',
        estadoPais: 'Distrito Capital',
        telefono: '',
        email: '',
        ocupacion: '',
        actividadEconomica: '',
        producto: 'Café verde',
        origen: 'Colombia',
        cantidad: '50 sacos',
        esPEP: false,
        origenIngresosDeclarado: 'Ventas de comercio propio y ahorros legítimos',
        capacidadEconomicaDeclarada: 'Demostrable con estados de cuenta bancarios',
        contratoFirmado: true,
        kycFirmado: true,
        cedulaAnexa: true,
        rifAnexo: true,
      },
      anticipo: {
        montoBs: 0,
        fecha: today,
        formaPago: 'Transferencia',
        bancoOrigen: 'Banco Provincial',
        bancoDestino: empresa.bancoPrincipal,
        referencia: '',
        facturaSeniat: '',
        titularCoincide: true,
        igtfAplicadoBs: 0,
      },
      divisas: {
        montoUsd: 0,
        tasaBCV: empresa.tasaBCVActual,
        montoBsEquivalente: 0,
        fechaCompra: today,
        bancoMesaCambio: `${empresa.bancoPrincipal} - Mesa de Cambio`,
        numeroSolicitud: '',
        declaracionOrigenDestino: true,
        igtfDivisas3Porc: 0,
        cuentaCustodiaUsd: empresa.cuentaCustodiaUsd,
      },
      proveedor: {
        nombreProveedor: '',
        paisProveedor: 'Colombia',
        rifOIdFiscal: '',
        facturaNumero: '',
        montoUsdFactura: 0,
        fechaPago: today,
        referenciaSwift: '',
        bancoCorresponsal: '',
        beneficiarioCoincide: true,
      },
      importacion: {
        numeroBL: '',
        fechaEmbarque: today,
        navieraOAgente: '',
        numeroDuela: '',
        fechaNacionalizacion: today,
        puertoEntrada: 'Puerto Cabello',
        arancelPagadoBs: 0,
        registroSunagroSica: '',
        permisoInsai: '',
      },
      entrega: {
        facturaDefinitivaSeniat: '',
        fechaEntrega: '',
        saldoCobradoBs: 0,
        saldoCobradoUsd: 0,
        comisionMargenEmpresa: '2% del valor en USD',
        entregadoConforme: false,
        actaEntregaFirmada: false,
        reconciliacionCuadrada: false,
      },
      documentos: {
        contratoCompraventa: true,
        cuestionarioKYC: true,
        copiaCedulaRif: true,
        facturaAnticipoSeniat: false,
        comprobantePagoCliente: false,
        solicitudDivisasBCV: false,
        declaracionOrigenDestinoLícito: true,
        facturaProveedor: false,
        comprobanteSwift: false,
        billOfLading: false,
        duelaAduana: false,
        licenciaSunagroInsai: false,
        facturaDefinitivaSeniat: false,
        comprobanteEntrega: false,
      },
      observaciones: 'Expediente nuevo en conformación documental.',
      elaboradoPor: empresa.representanteLegal,
      revisadoPor: empresa.representanteLegal,
    };

    setSelectedExpediente(nuevo);
    setIsDetailModalOpen(true);
  };

  const handleOpenExpediente = (op: ExpedienteOperacion) => {
    setSelectedExpediente(op);
    setIsDetailModalOpen(true);
  };

  // Guardar expediente (en estado local y en Firestore Cloud)
  const handleSaveExpediente = async (updated: ExpedienteOperacion) => {
    setExpedientes((prev) => {
      const exists = prev.some((e) => e.id === updated.id);
      if (exists) {
        return prev.map((e) => (e.id === updated.id ? updated : e));
      } else {
        return [updated, ...prev];
      }
    });

    try {
      await saveExpedienteToFirestore(updated);
      await logAuditoria(
        'Guardar Expediente',
        `Expediente ${updated.numeroExpediente} (${updated.cliente.nombre}) guardado en Firestore.`,
        'Oficial de Cumplimiento'
      );
    } catch (e) {
      console.error('Error saving to cloud:', e);
    }
  };

  // Eliminar expediente (en estado local y en Firestore Cloud)
  const handleDeleteExpediente = async (id: string) => {
    setExpedientes((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteExpedienteFromFirestore(id);
      await logAuditoria(
        'Eliminar Expediente',
        `Expediente ${id} eliminado de la base de datos.`,
        'Administrador'
      );
    } catch (e) {
      console.error('Error deleting from cloud:', e);
    }
  };

  // Guardar configuración de empresa
  const handleSaveEmpresa = async (nuevaEmpresa: DatosEmpresaImportadora) => {
    setEmpresa(nuevaEmpresa);
    try {
      await saveEmpresaToFirestore(nuevaEmpresa);
      await logAuditoria(
        'Actualizar Empresa',
        `Configuración institucional de ${nuevaEmpresa.razonSocial} y Tasa BCV (${nuevaEmpresa.tasaBCVActual} Bs/USD) actualizadas en Cloud.`,
        'Director Gerente'
      );
    } catch (e) {
      console.error('Error saving company config:', e);
    }
  };

  // Limpieza total de base de datos a solicitud del usuario
  const handleClearAllData = async () => {
    try {
      localStorage.setItem('sievex_user_explicitly_cleared', 'true');
      await clearAllExpedientesFromFirestore();
      setExpedientes([]);
      localStorage.removeItem(STORAGE_EXPEDIENTES);
      await logAuditoria(
        'Limpieza Total',
        'Base de datos limpiada por completo. Lista para originar expedientes reales desde CSV.',
        'Administrador'
      );
    } catch (e) {
      console.error('Error al limpiar base de datos:', e);
    }
  };

  // Carga directa de los 15 expedientes reales de personas naturales desde el extracto CSV
  const handleLoadRealCsvData = async () => {
    try {
      localStorage.removeItem('sievex_user_explicitly_cleared');
      for (const op of EXPEDIENTES_PERSONAS_NATURALES) {
        await saveExpedienteToFirestore(op);
      }
      setExpedientes(EXPEDIENTES_PERSONAS_NATURALES);
      try {
        localStorage.setItem(STORAGE_EXPEDIENTES, JSON.stringify(EXPEDIENTES_PERSONAS_NATURALES));
      } catch {}
      await logAuditoria(
        'Carga Extracto CSV Real',
        'Se originaron y guardaron los 15 expedientes de Personas Naturales del extracto bancario CSV con trazabilidad total.',
        'Oficial de Cumplimiento'
      );
    } catch (e) {
      console.error('Error al cargar datos reales del CSV:', e);
    }
  };

  // Carga e importación masiva de expedientes desde archivo CSV o texto
  const handleImportExpedientes = async (nuevos: ExpedienteOperacion[]) => {
    for (const op of nuevos) {
      await saveExpedienteToFirestore(op);
    }
    setExpedientes((prev) => {
      const merged = [...prev, ...nuevos];
      merged.sort((a, b) => a.numeroExpediente.localeCompare(b.numeroExpediente));
      try {
        localStorage.setItem(STORAGE_EXPEDIENTES, JSON.stringify(merged));
      } catch {}
      return merged;
    });
    await logAuditoria(
      'Carga Masiva CSV',
      `Se originaron ${nuevos.length} expedientes de Personas Naturales con trazabilidad bancaria completa.`,
      'Oficial de Cumplimiento'
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-800 flex flex-col font-sans">
      {/* Navegación Superior Minimalista */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        empresa={empresa}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onNewExpediente={handleNewExpediente}
        onOpenCsvImport={() => setIsCsvModalOpen(true)}
        totalExpedientes={expedientes.length}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6 sm:px-6">
        {activeTab === 'control-maestro' && (
          <ControlMaestroView
            expedientes={expedientes}
            empresa={empresa}
            onOpenExpediente={handleOpenExpediente}
            onNewExpediente={handleNewExpediente}
            onOpenCsvImport={() => setIsCsvModalOpen(true)}
            onClearAllData={handleClearAllData}
            onLoadRealCsvData={handleLoadRealCsvData}
          />
        )}

        {activeTab === 'expedientes' && (
          <ExpedientesView
            expedientes={expedientes}
            empresa={empresa}
            onOpenExpediente={handleOpenExpediente}
            onNewExpediente={handleNewExpediente}
            onDeleteExpediente={handleDeleteExpediente}
            onOpenCsvImport={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'rastro-efectivo' && (
          <RastroEfectivoView
            expedientes={expedientes}
            empresa={empresa}
            onOpenExpediente={handleOpenExpediente}
            onOpenCsvImport={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTab === 'contabilidad' && (
          <ContabilidadView
            expedientes={expedientes}
            empresa={empresa}
          />
        )}

        {activeTab === 'database' && (
          <BaseDeDatosPanel
            expedientes={expedientes}
            empresa={empresa}
            onRefreshFromCloud={() => {}}
            onOpenCsvImport={() => setIsCsvModalOpen(true)}
            onClearAllData={handleClearAllData}
            onLoadRealCsvData={handleLoadRealCsvData}
          />
        )}

        {activeTab === 'documentos' && (
          <DocumentosLegalesView
            expedientes={expedientes}
            empresa={empresa}
          />
        )}

        {activeTab === 'normativa' && <NormativaView empresa={empresa} />}
      </main>

      {/* Pie de página tranquilo y discreto */}
      <footer className="border-t border-stone-200/80 bg-white/70 py-4 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            SIEVEX · Sistema de Expedientes de Personas Naturales y Trazabilidad Cambiaria en Venezuela
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-stone-600 font-medium">
              Base de Datos Cloud Activa (Firestore)
            </span>
          </div>
        </div>
      </footer>

      {/* Modal de Detalle y Edición de Expediente */}
      {selectedExpediente && (
        <ExpedienteDetailModal
          expediente={selectedExpediente}
          empresa={empresa}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedExpediente(null);
          }}
          onSave={handleSaveExpediente}
        />
      )}

      {/* Modal de Configuración de la Empresa */}
      <CompanyConfigModal
        empresa={empresa}
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveEmpresa}
      />

      {/* Modal de Importación y Originación de Expedientes desde CSV / Excel */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        empresa={empresa}
        existingCount={expedientes.length}
        onExpedientesImported={handleImportExpedientes}
      />
    </div>
  );
}
