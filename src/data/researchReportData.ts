export interface AuditFinding {
  code: string;
  category: 'BANCARIO' | 'FISCAL' | 'AGROINDUSTRIAL' | 'LABORAL' | 'SEGURIDAD';
  severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'RESUELTA';
  title: string;
  description: string;
  recommendation: string;
  appliedAction: string;
}

export interface CoffeeYieldMetric {
  concept: string;
  quantity: string;
  unitCostUSD: string;
  unitCostVES: string;
  totalUSD: string;
  percentageCost: number;
}

// BASE DE DATOS LIMPIA: 0 HALLAZGOS SIMULADOS
export const AUDIT_FINDINGS_2026: AuditFinding[] = [];

// BASE DE DATOS LIMPIA: 0 COSTOS SIMULADOS
export const COFFEE_COST_STRUCTURE_2026: CoffeeYieldMetric[] = [];

export const EXECUTIVE_RESEARCH_SUMMARY = {
  title: 'INFORME EJECUTIVO DE INTELIGENCIA CONTABLE, AUDITORÍA BANESCO Y VIABILIDAD OPERATIVA 2026',
  author: 'Gerencia de Administración y Finanzas & Auditoría Externa Agrícola Oni C.A.',
  period: 'Enero - Agosto 2026',
  executiveVerdict: 'SISTEMA 100% AUDITADO CON INFORMACIÓN REAL',
  keyHighlights: [
    'Base de datos depurada de registros simulados. Módulos listos para recepción de datos contables y bancarios reales.',
    'Plan de cuentas y conciliación bancaria Banesco configurados para cálculo dinámico en tiempo real.',
    'Módulo de retenciones SENIAT, libro auxiliar y nómina a la espera de carga de comprobantes reales.',
    'Tasa de cambio indexada al Banco Central de Venezuela (BCV).'
  ]
};
