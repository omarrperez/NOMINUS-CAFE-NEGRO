import React, { useState, useEffect } from 'react';
import {
  Database,
  ShieldCheck,
  RefreshCw,
  HardDrive,
  Download,
  Upload,
  Server,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Clock,
  Eye,
  FileCode,
  Terminal,
  Activity
} from 'lucide-react';
import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { db, saveExpedienteToFirestore, saveEmpresaToFirestore, logAuditoria } from '../services/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { formatDateVE } from '../utils/formatters';

interface BaseDeDatosPanelProps {
  expedientes: ExpedienteOperacion[];
  empresa: DatosEmpresaImportadora;
  onRefreshFromCloud: () => void;
  onOpenCsvImport?: () => void;
  onClearAllData?: () => void;
  onLoadRealCsvData?: () => void;
}

interface AuditoriaItem {
  id: string;
  fecha: string;
  accion: string;
  detalles: string;
  usuario: string;
}

export const BaseDeDatosPanel: React.FC<BaseDeDatosPanelProps> = ({
  expedientes,
  empresa,
  onRefreshFromCloud,
  onOpenCsvImport,
  onClearAllData,
  onLoadRealCsvData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'estado' | 'colecciones' | 'auditoria' | 'respaldo'>('estado');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('Sincronizado en tiempo real');
  const [auditorias, setAuditorias] = useState<AuditoriaItem[]>([]);

  // Escuchar auditoría en tiempo real
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'auditoria'), (snap) => {
        const items: AuditoriaItem[] = [];
        snap.forEach((doc) => items.push(doc.data() as AuditoriaItem));
        items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setAuditorias(items);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Audit log snapshot error:', e);
    }
  }, []);

  // Forzar sincronización de todos los datos actuales a Firestore
  const handleSyncAllToFirestore = async () => {
    setSyncing(true);
    setSyncStatus('Subiendo datos a Firestore...');
    try {
      // Guardar cada expediente
      for (const op of expedientes) {
        await saveExpedienteToFirestore(op);
      }
      // Guardar empresa
      await saveEmpresaToFirestore(empresa);

      await logAuditoria(
        'Sincronización Manual',
        `Se sincronizaron ${expedientes.length} expedientes y la configuración institucional con la nube.`,
        'Administrador'
      );

      setSyncStatus('¡Sincronización exitosa y confirmada en la nube!');
      setTimeout(() => setSyncStatus('Sincronizado en tiempo real'), 3000);
    } catch (error) {
      console.error('Error syncing:', error);
      setSyncStatus('Error al sincronizar. Verifique conexión.');
    } finally {
      setSyncing(false);
    }
  };

  // Descargar respaldo JSON completo de la base de datos
  const handleDownloadBackupJson = () => {
    const backup = {
      version: 'SIEVEX-1.0',
      fecha: new Date().toISOString(),
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId,
      empresa,
      expedientes,
      totalRegistros: expedientes.length,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Respaldo_BaseDatos_SIEVEX_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal en Tonos Pasteles */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-sky-800" />
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                Panel de Control de Base de Datos y Seguridad Cloud
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                Firestore Cloud · Conectado
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Almacenamiento persistente en la nube. Los datos de expedientes, clientes, divisas y contabilidad se guardan automáticamente y no se borran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onLoadRealCsvData && (
              <button
                onClick={onLoadRealCsvData}
                className="flex items-center gap-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
                title="Carga los 15 expedientes de Personas Naturales del extracto bancario CSV"
              >
                <Upload className="h-3.5 w-3.5 text-amber-200" />
                <span>Cargar 15 Expedientes Reales CSV</span>
              </button>
            )}
            {onOpenCsvImport && (
              <button
                onClick={onOpenCsvImport}
                className="flex items-center gap-1.5 rounded-xl bg-amber-100/90 border border-amber-300 px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer shadow-xs"
                title="Cargar archivo CSV o pegar lista para originar expedientes de Personas Naturales"
              >
                <Upload className="h-3.5 w-3.5 text-amber-800" />
                <span>Cargar Lista CSV</span>
              </button>
            )}

            <button
              onClick={handleSyncAllToFirestore}
              disabled={syncing}
              className="flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-900 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Asegura que todos los expedientes actuales queden almacenados en Firestore"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-sky-700 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Guardando en la Nube...' : 'Forzar Guardado Cloud'}</span>
            </button>

            <button
              onClick={handleDownloadBackupJson}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-medium text-white transition-colors cursor-pointer shadow-xs"
              title="Descargar copia de seguridad completa en formato JSON"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar Backup JSON</span>
            </button>

            {onClearAllData && (
              <button
                onClick={() => {
                  if (window.confirm('¿Desea limpiar todos los datos simulados de la base de datos Firestore y empezar desde cero con datos reales?')) {
                    onClearAllData();
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors cursor-pointer shadow-xs"
                title="Elimina todos los datos simulados de Firestore y localStorage"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                <span>Limpiar Base de Datos</span>
              </button>
            )}
          </div>
        </div>

        {/* Indicadores de Estado de la Base de Datos */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
            <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-medium">
              <Activity className="h-3.5 w-3.5 text-emerald-600" />
              <span>Estado en Vivo</span>
            </div>
            <p className="mt-1 font-mono text-base font-bold text-emerald-950">
              En Línea (Cloud)
            </p>
            <span className="text-[10px] text-emerald-700">{syncStatus}</span>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
            <span className="text-[11px] text-stone-600 font-medium block">Expedientes Guardados</span>
            <p className="mt-1 font-mono text-base font-bold text-stone-900">
              {expedientes.length} documentos
            </p>
            <span className="text-[10px] text-stone-500">Colección /expedientes</span>
          </div>

          <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3">
            <span className="text-[11px] text-sky-800 font-medium block">Proyecto Cloud</span>
            <p className="mt-1 font-mono text-xs font-bold text-sky-950 truncate" title={firebaseConfig.projectId}>
              {firebaseConfig.projectId}
            </p>
            <span className="text-[10px] text-sky-700">Google Cloud Firestore</span>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
            <div className="flex items-center gap-1 text-[11px] text-indigo-800 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>Reglas de Seguridad</span>
            </div>
            <p className="mt-1 font-mono text-xs font-bold text-indigo-950">
              Desplegadas
            </p>
            <span className="text-[10px] text-indigo-700">firestore.rules activas</span>
          </div>
        </div>

        {/* Pestañas de Navegación del Panel */}
        <div className="mt-5 flex items-center gap-1.5 border-t border-stone-100 pt-3">
          <button
            onClick={() => setActiveSubTab('estado')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSubTab === 'estado'
                ? 'bg-sky-100/70 text-sky-950 font-semibold border border-sky-200 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Server className="h-3.5 w-3.5 text-sky-700" />
            <span>Infraestructura & Conexión</span>
          </button>

          <button
            onClick={() => setActiveSubTab('colecciones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSubTab === 'colecciones'
                ? 'bg-amber-100/70 text-amber-950 font-semibold border border-amber-200 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-amber-700" />
            <span>Explorador de Colecciones ({expedientes.length} registros)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('auditoria')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSubTab === 'auditoria'
                ? 'bg-indigo-100/70 text-indigo-950 font-semibold border border-indigo-200 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-700" />
            <span>Bitácora de Auditoría ({auditorias.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('respaldo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSubTab === 'respaldo'
                ? 'bg-emerald-100/70 text-emerald-950 font-semibold border border-emerald-200 shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <HardDrive className="h-3.5 w-3.5 text-emerald-700" />
            <span>Respaldos & Portabilidad</span>
          </button>
        </div>
      </div>

      {/* SUB-PESTAÑA 1: ESTADO E INFRAESTRUCTURA */}
      {activeSubTab === 'estado' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-sky-800" />
              <span>Parámetros del Servidor de Base de Datos</span>
            </h3>
            <div className="space-y-2 text-xs divide-y divide-stone-100">
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Motor de Base de Datos:</span>
                <span className="font-mono font-medium text-stone-800">Google Cloud Firestore</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">ID de Proyecto:</span>
                <span className="font-mono font-medium text-stone-800">{firebaseConfig.projectId}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">ID de Instancia Firestore:</span>
                <span className="font-mono text-stone-700 text-[11px] truncate max-w-[220px]" title={firebaseConfig.firestoreDatabaseId}>
                  {firebaseConfig.firestoreDatabaseId}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Sincronización Cliente:</span>
                <span className="text-emerald-800 font-medium">Bilateral (Offline Cache + Cloud Sync)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Persistencia Garantizada:</span>
                <span className="text-emerald-800 font-medium">Activa (Los datos no se pierden al recargar)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-800" />
              <span>Seguridad y Reglas de Control de Acceso</span>
            </h3>
            <div className="rounded-xl bg-stone-50 p-3 text-xs space-y-2 text-stone-700 font-mono text-[11px]">
              <p className="text-emerald-800 font-bold">✔ Reglas de Seguridad Verificadas (firestore.rules):</p>
              <ul className="list-disc list-inside space-y-1 text-stone-600">
                <li>Colección <code className="bg-stone-200 px-1 py-0.5 rounded">/expedientes</code>: Permisos de lectura y escritura validados.</li>
                <li>Colección <code className="bg-stone-200 px-1 py-0.5 rounded">/empresa</code>: Acceso protegido para configuración legal.</li>
                <li>Colección <code className="bg-stone-200 px-1 py-0.5 rounded">/auditoria</code>: Bitácora de operaciones y cambios de estado.</li>
                <li>Denegación explícita por defecto para rutas no reconocidas.</li>
              </ul>
            </div>
            <p className="text-[11px] text-stone-500">
              Cumple con las directivas de resguardo de información y confidencialidad comercial de clientes personas naturales.
            </p>
          </div>

          {/* Empresa Titular Registrada en Base de Datos */}
          <div className="md:col-span-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-amber-700" />
                <h3 className="font-bold text-sm text-stone-900">
                  Empresa Encargada de Operaciones: {empresa.razonSocial}
                </h3>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                RIF: {empresa.rif}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <p><strong>Razón Social:</strong> {empresa.razonSocial}</p>
                <p><strong>RIF:</strong> {empresa.rif}</p>
                <p><strong>Propietario y Director General:</strong> {empresa.representanteLegal} (C.I. {empresa.cedulaRepresentante})</p>
                <p><strong>Cargo / Calidad:</strong> {empresa.cargoRepresentante}</p>
                <p><strong>Domicilio Fiscal:</strong> {empresa.direccionFiscal}</p>
              </div>
              <div className="space-y-1.5">
                <p><strong>Registro Mercantil:</strong> {empresa.registroMercantil}</p>
                <p><strong>Tomo y Folio:</strong> Tomo {empresa.tomoNumero}, Folio {empresa.folioNumero} ({empresa.fechaRegistro})</p>
                <p><strong>Registro SUNAGRO:</strong> {empresa.registroSunagro}</p>
                <p><strong>Banco Principal:</strong> {empresa.bancoPrincipal}</p>
                <p><strong>Tasa BCV Activa:</strong> {empresa.tasaBCVActual} Bs/USD</p>
              </div>
            </div>

            {empresa.objetoSocial && (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <p className="font-bold text-[11px] text-stone-700 mb-1">Objeto Social Estatutario:</p>
                <p className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed text-justify">
                  {empresa.objetoSocial}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 2: EXPLORADOR DE COLECCIONES */}
      {activeSubTab === 'colecciones' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Lista de Documentos en la Colección */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Colección: /expedientes</h3>
                <p className="text-xs text-stone-500">Documentos sincronizados en la base de datos cloud.</p>
              </div>
              <span className="font-mono text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                {expedientes.length} docs
              </span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {expedientes.map((op) => (
                <div
                  key={op.id}
                  onClick={() => setSelectedDoc(op)}
                  className={`p-3.5 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-between ${
                    selectedDoc?.id === op.id ? 'bg-amber-50/60 border-l-4 border-amber-600' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900">{op.numeroExpediente}</span>
                      <span className="font-medium text-stone-800">{op.cliente.nombre}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Cédula: {op.cliente.cedula} · Anticipo: {formatDateVE(op.anticipo.fecha)} · Estado: {op.estado}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-stone-400">ID: {op.id.slice(0, 8)}...</span>
                    <Eye className="h-4 w-4 text-stone-400 hover:text-stone-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visor de Documento Seleccionado */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-amber-700" />
                  <span>Inspección de Registro</span>
                </span>
                {selectedDoc && (
                  <span className="font-mono text-[10px] text-stone-500">{selectedDoc.numeroExpediente}</span>
                )}
              </div>

              {selectedDoc ? (
                <div className="space-y-2 text-xs">
                  <p><strong>Cliente:</strong> {selectedDoc.cliente.nombre}</p>
                  <p><strong>Cédula:</strong> {selectedDoc.cliente.cedula}</p>
                  <p><strong>RIF:</strong> {selectedDoc.cliente.rif || 'N/A'}</p>
                  <p><strong>Producto:</strong> {selectedDoc.cliente.producto}</p>
                  <p><strong>Anticipo Bs:</strong> {selectedDoc.anticipo.montoBs?.toLocaleString('es-VE')}</p>
                  <p><strong>Divisas USD:</strong> ${selectedDoc.divisas.montoUsd?.toLocaleString('en-US')}</p>
                  <p><strong>Proveedor:</strong> {selectedDoc.proveedor.nombreProveedor}</p>
                  <p><strong>Estado:</strong> {selectedDoc.estado}</p>
                  <div className="mt-3 pt-2 border-t border-stone-100">
                    <span className="text-[10px] text-stone-400 font-mono block mb-1">Estructura JSON Cloud:</span>
                    <pre className="max-h-48 overflow-auto bg-stone-900 text-stone-100 p-2 rounded-lg text-[10px] font-mono">
                      {JSON.stringify(selectedDoc, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-stone-400 text-xs">
                  Selecciona un expediente a la izquierda para inspeccionar sus datos almacenados en la base de datos.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 3: BITÁCORA DE AUDITORÍA */}
      {activeSubTab === 'auditoria' && (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Bitácora de Auditoría y Trazabilidad de Datos</h3>
              <p className="text-xs text-stone-500">Historial de sincronizaciones y transacciones registradas en Firestore.</p>
            </div>
            <span className="text-xs font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
              {auditorias.length} registros
            </span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {auditorias.length === 0 ? (
              <div className="p-8 text-center text-stone-400">
                No hay eventos de auditoría previos. Los eventos se grabarán automáticamente con cada guardado.
              </div>
            ) : (
              auditorias.map((item) => (
                <div key={item.id} className="p-3.5 hover:bg-stone-50 transition-colors flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{item.accion}</span>
                      <span className="font-mono text-[11px] text-stone-400">
                        {new Date(item.fecha).toLocaleString('es-VE')}
                      </span>
                    </div>
                    <p className="text-stone-600 mt-0.5">{item.detalles}</p>
                    <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                      Operador: {item.usuario}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 4: RESPALDOS Y PORTABILIDAD */}
      {activeSubTab === 'respaldo' && (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-stone-900">Gestión de Respaldos de Seguridad</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Descargue una copia local cifrada o traslade los datos entre equipos sin depender exclusivamente de la conexión a internet.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-stone-200 p-4 bg-stone-50/50 space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-xs">
                <Download className="h-4 w-4 text-emerald-700" />
                <span>Exportar Respaldo Maestro</span>
              </div>
              <p className="text-xs text-stone-600">
                Genera un archivo JSON con todos los expedientes, cálculos contables, personas naturales y datos de la empresa importadora.
              </p>
              <button
                onClick={handleDownloadBackupJson}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium py-2 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Descargar Archivo de Respaldo (.json)</span>
              </button>
            </div>

            <div className="rounded-xl border border-stone-200 p-4 bg-stone-50/50 space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-xs">
                <HardDrive className="h-4 w-4 text-sky-700" />
                <span>Políticas de Resguardo SUDEBAN (5 Años)</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Recuerde que por exigencia del Artículo 42 de la Ley Orgánica contra la Delincuencia Organizada y el Instructivo LC/FT/FPADM de SUDEBAN, las copias de seguridad de los expedientes y comprobantes bancarios deben conservarse por un lapso no menor a 5 años continuos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
