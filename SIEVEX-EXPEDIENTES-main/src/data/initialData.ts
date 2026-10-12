import { DatosEmpresaImportadora, ExpedienteOperacion } from '../types';
import { EXPEDIENTES_PERSONAS_NATURALES } from './realBankData';

export const DATOS_EMPRESA_DEFAULT: DatosEmpresaImportadora = {
  razonSocial: 'AGRICOLA ONI, C.A.',
  rif: 'J-50145638-0',
  registroMercantil: 'Registro Mercantil Primero de la Circunscripción Judicial del Estado Anzoátegui',
  tomoNumero: '88-A',
  folioNumero: '124',
  fechaRegistro: '12/04/2021',
  circunscripcion: 'Barcelona, Estado Anzoátegui',
  direccionFiscal: 'Calle Las Flores, Quinta Blanquita, Local 2, Crucero de Lechería, Barcelona, Estado Anzoátegui, Venezuela',
  ciudadEstado: 'Barcelona, Estado Anzoátegui, Venezuela',
  representanteLegal: 'TRIAS ABREU, ELIAS RAFAEL',
  cedulaRepresentante: 'V-23997829',
  cargoRepresentante: 'Propietario y Director General',
  telefono: '+58 281 286-1190 / +58 414 820-7733',
  email: 'administracion@agricolaoni.com',
  registroSunagro: 'SICA-AGRO-2024-5014',
  bancoPrincipal: 'Banco Provincial / Banco Nacional de Crédito (BNC)',
  cuentaBancariaBs: '0108-0024-51-0100452391',
  cuentaCustodiaUsd: '0108-0024-59-0200114589 (Convenio Cambiario N° 1)',
  tasaBCVActual: 683.3971,
  objetoSocial: 'La sociedad tendrá como objeto todo acto de comercio destinado a la planificación, siembra, recolección, procesamiento y transporte de todo tipo de materia prima vegetal; importación y exportación de tipo de materia prima vegetal, maquinarias, equipos agrícolas e industriales. Compra, venta, manufactura, distribución, transporte y comercialización de todo tipo productos de consumo masivo. En general, la sociedad podrá realizar cualquier actividad de licito comercio que persiga la obtención de beneficios para sus socios. Pudiendo ejercer cualquier otro tipo de actividad de licito comercio que este conexo con su objeto principal',
};

// Expedientes reales originados directamente del extracto bancario CSV (15 Personas Naturales)
export const EXPEDIENTES_INICIALES: ExpedienteOperacion[] = EXPEDIENTES_PERSONAS_NATURALES;
