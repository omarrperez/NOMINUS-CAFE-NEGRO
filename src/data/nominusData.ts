export interface CompanyProfile {
  id: string;
  name: string;
  tradeName: string;
  rif: string;
  nit?: string;
  registroMercantil: string;
  address: string;
  phone: string;
  email: string;
  legalRepresentative: string;
  idNumber: string;
  role: string;
  sector: string;
  foundedYear: number;
  fiscalYear: string;
  banescoAccountVES: string;
  banescoAccountUSD: string;
  cvcLicense: string; // Corporación Venezolana del Café
  sicaRegistry: string; // Sistema Integral de Control Agroalimentario
}

export interface BcvRateItem {
  date: string;
  rateUsd: number;
  rateEur: number;
  bidUsd?: number;
  askUsd?: number;
  variationPct: number;
  source: string;
}

export const COMPANIES: CompanyProfile[] = [
  {
    id: 'agricola-oni',
    name: 'AGRÍCOLA ONI, C.A.',
    tradeName: 'Agrícola Oni',
    rif: 'J-50145638-0',
    registroMercantil: 'Registro Mercantil Primero del Estado Anzoátegui, Tomo 44-A, Nro. 12',
    address: 'Av. Intercomunal Jorge Rodríguez, Sector Las Garzas, Barcelona / Lechería, Edo. Anzoátegui, Venezuela',
    phone: '+58 (281) 286-8492 / +58 (414) 819-1044',
    email: 'administracion@agricolaoni.com.ve',
    legalRepresentative: 'Elias Rafael Trías Abreu',
    idNumber: 'V-23.997.829',
    role: 'Presidente / Propietario',
    sector: 'Intermediación Comercial & Compra de Café 100% Nacional (Gestión de Anticipos en Bolívares de Clientes a Tasa Oficial BCV, Procura y Comercialización en Anzoátegui y Venezuela, Contratos a Futuro con Empresas y Productores Nacionales, Sustitución por Facturas de Venta en Octubre 2026)',
    foundedYear: 2021,
    fiscalYear: '01/01/2026 - 31/12/2026',
    banescoAccountVES: '0134-0342-18-3421089912',
    banescoAccountUSD: '0134-0342-12-3420084712',
    cvcLicense: 'CVC-NAC-2026-0418',
    sicaRegistry: 'SICA-VE-8941094',
  }
];

// SERIE HISTÓRICA OFICIAL DE PRECIOS DEL DÓLAR (BID / ASK) ENERO 2026 A AGOSTO 2026
export const BCV_RATES_HISTORY: BcvRateItem[] = [
  // AGOSTO 2026
  { date: '31/08/2026', bidUsd: 796.330185, askUsd: 798.326000, rateUsd: 798.326000, rateEur: 854.208820, variationPct: 0.42, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '28/08/2026', bidUsd: 793.004221, askUsd: 794.991700, rateUsd: 794.991700, rateEur: 850.641119, variationPct: 0.42, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '27/08/2026', bidUsd: 789.687533, askUsd: 791.666700, rateUsd: 791.666700, rateEur: 847.083369, variationPct: 0.04, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '26/08/2026', bidUsd: 789.346488, askUsd: 791.324800, rateUsd: 791.324800, rateEur: 846.717536, variationPct: 0.48, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '25/08/2026', bidUsd: 785.550801, askUsd: 787.519600, rateUsd: 787.519600, rateEur: 842.645972, variationPct: 0.31, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '24/08/2026', bidUsd: 783.106627, askUsd: 785.069300, rateUsd: 785.069300, rateEur: 840.024151, variationPct: 0.05, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '21/08/2026', bidUsd: 782.701642, askUsd: 784.663300, rateUsd: 784.663300, rateEur: 839.589731, variationPct: 0.60, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '20/08/2026', bidUsd: 778.002320, askUsd: 779.952200, rateUsd: 779.952200, rateEur: 834.548854, variationPct: 0.33, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '19/08/2026', bidUsd: 775.472560, askUsd: 777.416100, rateUsd: 777.416100, rateEur: 831.835227, variationPct: 0.27, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '18/08/2026', bidUsd: 773.397261, askUsd: 775.335600, rateUsd: 775.335600, rateEur: 829.609092, variationPct: 0.26, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '17/08/2026', bidUsd: 771.379219, askUsd: 773.312500, rateUsd: 773.312500, rateEur: 827.444375, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '14/08/2026', bidUsd: 770.612740, askUsd: 772.544100, rateUsd: 772.544100, rateEur: 826.622187, variationPct: 0.19, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '13/08/2026', bidUsd: 769.143722, askUsd: 771.071400, rateUsd: 771.071400, rateEur: 825.046398, variationPct: 0.55, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '12/08/2026', bidUsd: 764.943149, askUsd: 766.860300, rateUsd: 766.860300, rateEur: 820.540521, variationPct: 0.33, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '11/08/2026', bidUsd: 762.437729, askUsd: 764.348600, rateUsd: 764.348600, rateEur: 817.853002, variationPct: 0.41, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '10/08/2026', bidUsd: 759.313658, askUsd: 761.216700, rateUsd: 761.216700, rateEur: 814.501869, variationPct: 0.49, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '07/08/2026', bidUsd: 755.646749, askUsd: 757.540600, rateUsd: 757.540600, rateEur: 810.568442, variationPct: 0.11, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '06/08/2026', bidUsd: 754.816529, askUsd: 756.708300, rateUsd: 756.708300, rateEur: 809.677881, variationPct: 0.11, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '05/08/2026', bidUsd: 754.010350, askUsd: 755.900100, rateUsd: 755.900100, rateEur: 808.813107, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '04/08/2026', bidUsd: 753.267312, askUsd: 755.155200, rateUsd: 755.155200, rateEur: 808.016064, variationPct: 0.41, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '03/08/2026', bidUsd: 750.214064, askUsd: 752.094300, rateUsd: 752.094300, rateEur: 804.740901, variationPct: 0.44, source: 'Banco Central de Venezuela / Mesa Cambiaria' },

  // JULIO 2026
  { date: '31/07/2026', bidUsd: 746.914434, askUsd: 748.786400, rateUsd: 748.786400, rateEur: 801.201448, variationPct: 0.29, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '30/07/2026', bidUsd: 744.763126, askUsd: 746.629700, rateUsd: 746.629700, rateEur: 798.893779, variationPct: 0.13, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '29/07/2026', bidUsd: 743.773007, askUsd: 745.637100, rateUsd: 745.637100, rateEur: 797.831697, variationPct: 0.19, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '28/07/2026', bidUsd: 742.365834, askUsd: 744.226400, rateUsd: 744.226400, rateEur: 796.322248, variationPct: 0.19, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '27/07/2026', bidUsd: 740.953474, askUsd: 742.810500, rateUsd: 742.810500, rateEur: 794.807235, variationPct: 0.08, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '23/07/2026', bidUsd: 740.373627, askUsd: 742.229200, rateUsd: 742.229200, rateEur: 794.185244, variationPct: 0.59, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '22/07/2026', bidUsd: 736.036896, askUsd: 737.881600, rateUsd: 737.881600, rateEur: 789.533312, variationPct: 0.09, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '21/07/2026', bidUsd: 735.389020, askUsd: 737.232100, rateUsd: 737.232100, rateEur: 788.838347, variationPct: 0.00, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '20/07/2026', bidUsd: 735.389020, askUsd: 737.232100, rateUsd: 737.232100, rateEur: 788.838347, variationPct: 0.04, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '17/07/2026', bidUsd: 735.091565, askUsd: 736.933900, rateUsd: 736.933900, rateEur: 788.519273, variationPct: 0.61, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '16/07/2026', bidUsd: 730.647503, askUsd: 732.478700, rateUsd: 732.478700, rateEur: 783.752209, variationPct: 0.69, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '15/07/2026', bidUsd: 725.632572, askUsd: 727.451200, rateUsd: 727.451200, rateEur: 778.372784, variationPct: 0.23, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '14/07/2026', bidUsd: 723.932633, askUsd: 725.747000, rateUsd: 725.747000, rateEur: 776.549290, variationPct: 0.24, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '13/07/2026', bidUsd: 722.189003, askUsd: 723.999000, rateUsd: 723.999000, rateEur: 774.678930, variationPct: 0.37, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '10/07/2026', bidUsd: 719.542236, askUsd: 721.345600, rateUsd: 721.345600, rateEur: 771.839792, variationPct: 1.64, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '09/07/2026', bidUsd: 707.919266, askUsd: 709.693500, rateUsd: 709.693500, rateEur: 759.372045, variationPct: 1.35, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '08/07/2026', bidUsd: 698.474338, askUsd: 700.224900, rateUsd: 700.224900, rateEur: 749.240643, variationPct: 2.08, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '07/07/2026', bidUsd: 684.227843, askUsd: 685.942700, rateUsd: 685.942700, rateEur: 733.958689, variationPct: 1.63, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '06/07/2026', bidUsd: 673.243174, askUsd: 674.930500, rateUsd: 674.930500, rateEur: 722.175635, variationPct: 1.18, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '03/07/2026', bidUsd: 665.382375, askUsd: 667.050000, rateUsd: 667.050000, rateEur: 713.743500, variationPct: 2.16, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '02/07/2026', bidUsd: 651.340169, askUsd: 652.972600, rateUsd: 652.972600, rateEur: 698.680682, variationPct: 2.07, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '01/07/2026', bidUsd: 638.103643, askUsd: 639.702900, rateUsd: 639.702900, rateEur: 684.482103, variationPct: 1.00, source: 'Banco Central de Venezuela / Mesa Cambiaria' },

  // JUNIO 2026
  { date: '30/06/2026', bidUsd: 631.780989, askUsd: 633.364400, rateUsd: 633.364400, rateEur: 677.699908, variationPct: 1.66, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '26/06/2026', bidUsd: 621.464744, askUsd: 623.022300, rateUsd: 623.022300, rateEur: 666.633861, variationPct: 0.13, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '25/06/2026', bidUsd: 620.657966, askUsd: 622.213500, rateUsd: 622.213500, rateEur: 665.768445, variationPct: 0.11, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '23/06/2026', bidUsd: 619.976075, askUsd: 621.529900, rateUsd: 621.529900, rateEur: 665.036993, variationPct: 0.63, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '22/06/2026', bidUsd: 616.094703, askUsd: 617.638800, rateUsd: 617.638800, rateEur: 660.873516, variationPct: 0.85, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '19/06/2026', bidUsd: 610.902117, askUsd: 612.433200, rateUsd: 612.433200, rateEur: 655.303524, variationPct: 0.83, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '18/06/2026', bidUsd: 605.873420, askUsd: 607.391900, rateUsd: 607.391900, rateEur: 649.909333, variationPct: 0.84, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '17/06/2026', bidUsd: 600.826569, askUsd: 602.332400, rateUsd: 602.332400, rateEur: 644.495668, variationPct: 0.93, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '16/06/2026', bidUsd: 595.290444, askUsd: 596.782400, rateUsd: 596.782400, rateEur: 638.557168, variationPct: 0.72, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '15/06/2026', bidUsd: 591.035009, askUsd: 592.516300, rateUsd: 592.516300, rateEur: 633.992441, variationPct: 0.87, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '12/06/2026', bidUsd: 585.937385, askUsd: 587.405900, rateUsd: 587.405900, rateEur: 628.524313, variationPct: 0.81, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '11/06/2026', bidUsd: 581.229485, askUsd: 582.686200, rateUsd: 582.686200, rateEur: 623.474234, variationPct: 0.89, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '10/06/2026', bidUsd: 576.102235, askUsd: 577.546100, rateUsd: 577.546100, rateEur: 617.974327, variationPct: 0.85, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '09/06/2026', bidUsd: 571.246704, askUsd: 572.678400, rateUsd: 572.678400, rateEur: 612.765888, variationPct: 0.89, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '05/06/2026', bidUsd: 566.263593, askUsd: 567.682800, rateUsd: 567.682800, rateEur: 607.420596, variationPct: 0.78, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '04/06/2026', bidUsd: 561.880977, askUsd: 563.289200, rateUsd: 563.289200, rateEur: 602.719444, variationPct: 0.52, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '03/06/2026', bidUsd: 558.974362, askUsd: 560.375300, rateUsd: 560.375300, rateEur: 599.601571, variationPct: 0.31, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '02/06/2026', bidUsd: 557.246991, askUsd: 558.643600, rateUsd: 558.643600, rateEur: 597.748652, variationPct: 0.12, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '01/06/2026', bidUsd: 556.579165, askUsd: 557.974100, rateUsd: 557.974100, rateEur: 597.032287, variationPct: 0.64, source: 'Banco Central de Venezuela / Mesa Cambiaria' },

  // MAYO 2026
  { date: '29/05/2026', bidUsd: 553.039736, askUsd: 554.425800, rateUsd: 554.425800, rateEur: 593.235606, variationPct: 0.92, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '28/05/2026', bidUsd: 547.998171, askUsd: 549.371600, rateUsd: 549.371600, rateEur: 587.827612, variationPct: 0.88, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '27/05/2026', bidUsd: 543.217952, askUsd: 544.579400, rateUsd: 544.579400, rateEur: 582.699958, variationPct: 0.77, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '26/05/2026', bidUsd: 538.692992, askUsd: 540.043100, rateUsd: 540.043100, rateEur: 577.846117, variationPct: 0.87, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '25/05/2026', bidUsd: 534.046837, askUsd: 535.385300, rateUsd: 535.385300, rateEur: 572.862271, variationPct: 0.92, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '22/05/2026', bidUsd: 529.178438, askUsd: 530.504700, rateUsd: 530.504700, rateEur: 567.640029, variationPct: 0.69, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '21/05/2026', bidUsd: 525.552227, askUsd: 526.869400, rateUsd: 526.869400, rateEur: 563.750258, variationPct: 0.61, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '20/05/2026', bidUsd: 522.365813, askUsd: 523.675000, rateUsd: 523.675000, rateEur: 560.332250, variationPct: 0.53, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '19/05/2026', bidUsd: 519.611915, askUsd: 520.914200, rateUsd: 520.914200, rateEur: 557.378194, variationPct: 0.57, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '15/05/2026', bidUsd: 516.666995, askUsd: 517.961900, rateUsd: 517.961900, rateEur: 554.219233, variationPct: 0.54, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '14/05/2026', bidUsd: 513.892050, askUsd: 515.180000, rateUsd: 515.180000, rateEur: 551.242600, variationPct: 0.86, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '13/05/2026', bidUsd: 509.510332, askUsd: 510.787300, rateUsd: 510.787300, rateEur: 546.542411, variationPct: 0.43, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '12/05/2026', bidUsd: 507.328899, askUsd: 508.600400, rateUsd: 508.600400, rateEur: 544.202428, variationPct: 0.73, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '11/05/2026', bidUsd: 503.652314, askUsd: 504.914600, rateUsd: 504.914600, rateEur: 540.258622, variationPct: 0.89, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '08/05/2026', bidUsd: 499.209449, askUsd: 500.460600, rateUsd: 500.460600, rateEur: 535.492842, variationPct: 0.12, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '07/05/2026', bidUsd: 498.611148, askUsd: 499.860800, rateUsd: 499.860800, rateEur: 534.851056, variationPct: 0.61, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '06/05/2026', bidUsd: 495.588025, askUsd: 496.830100, rateUsd: 496.830100, rateEur: 531.608207, variationPct: 0.62, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '05/05/2026', bidUsd: 492.143059, askUsd: 493.376500, rateUsd: 493.376500, rateEur: 527.912855, variationPct: 0.68, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '04/05/2026', bidUsd: 488.819090, askUsd: 490.044200, rateUsd: 490.044200, rateEur: 524.347294, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },

  // ABRIL 2026
  { date: '30/04/2026', bidUsd: 488.330813, askUsd: 489.554700, rateUsd: 489.554700, rateEur: 523.823529, variationPct: 0.49, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '29/04/2026', bidUsd: 485.901402, askUsd: 487.119200, rateUsd: 487.119200, rateEur: 521.217544, variationPct: 0.19, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '28/04/2026', bidUsd: 484.980011, askUsd: 486.195500, rateUsd: 486.195500, rateEur: 520.229185, variationPct: 0.19, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '27/04/2026', bidUsd: 484.012037, askUsd: 485.225100, rateUsd: 485.225100, rateEur: 519.190857, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '24/04/2026', bidUsd: 483.528549, askUsd: 484.740400, rateUsd: 484.740400, rateEur: 518.672228, variationPct: 0.18, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '23/04/2026', bidUsd: 482.659826, askUsd: 483.869500, rateUsd: 483.869500, rateEur: 517.740365, variationPct: 0.11, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '22/04/2026', bidUsd: 482.129555, askUsd: 483.337900, rateUsd: 483.337900, rateEur: 517.171553, variationPct: 0.12, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '21/04/2026', bidUsd: 481.551704, askUsd: 482.758600, rateUsd: 482.758600, rateEur: 516.551702, variationPct: 0.22, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '20/04/2026', bidUsd: 480.494653, askUsd: 481.698900, rateUsd: 481.698900, rateEur: 515.417823, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '17/04/2026', bidUsd: 480.014656, askUsd: 481.217700, rateUsd: 481.217700, rateEur: 514.902939, variationPct: 0.20, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '16/04/2026', bidUsd: 479.056557, askUsd: 480.257200, rateUsd: 480.257200, rateEur: 513.875204, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '15/04/2026', bidUsd: 478.578056, askUsd: 479.777500, rateUsd: 479.777500, rateEur: 513.361925, variationPct: 0.25, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '14/04/2026', bidUsd: 477.384647, askUsd: 478.581100, rateUsd: 478.581100, rateEur: 512.081777, variationPct: 0.20, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '13/04/2026', bidUsd: 476.431835, askUsd: 477.625900, rateUsd: 477.625900, rateEur: 511.059713, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '10/04/2026', bidUsd: 475.955928, askUsd: 477.148800, rateUsd: 477.148800, rateEur: 510.549216, variationPct: 0.15, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '09/04/2026', bidUsd: 475.243115, askUsd: 476.434200, rateUsd: 476.434200, rateEur: 509.784594, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '08/04/2026', bidUsd: 474.768404, askUsd: 475.958300, rateUsd: 475.958300, rateEur: 509.275381, variationPct: 0.19, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '07/04/2026', bidUsd: 473.820779, askUsd: 475.008300, rateUsd: 475.008300, rateEur: 508.258881, variationPct: -0.11, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '06/04/2026', bidUsd: 473.347466, askUsd: 474.533800, rateUsd: 474.533800, rateEur: 507.751166, variationPct: 0.10, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '01/04/2026', bidUsd: 472.874651, askUsd: 474.059800, rateUsd: 474.059800, rateEur: 507.243986, variationPct: 0.03, source: 'Banco Central de Venezuela / Mesa Cambiaria' },

  // MARZO 2026
  { date: '31/03/2026', bidUsd: 472.732806, askUsd: 473.917600, rateUsd: 473.917600, rateEur: 507.091832, variationPct: 0.01, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '30/03/2026', bidUsd: 472.685525, askUsd: 473.870200, rateUsd: 473.870200, rateEur: 507.041114, variationPct: 0.46, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '27/03/2026', bidUsd: 470.521149, askUsd: 471.700400, rateUsd: 471.700400, rateEur: 504.719428, variationPct: 0.68, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '26/03/2026', bidUsd: 467.343214, askUsd: 468.514500, rateUsd: 468.514500, rateEur: 501.310515, variationPct: 0.41, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '25/03/2026', bidUsd: 465.434897, askUsd: 466.601400, rateUsd: 466.601400, rateEur: 499.263498, variationPct: 0.85, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '24/03/2026', bidUsd: 461.512028, askUsd: 462.668700, rateUsd: 462.668700, rateEur: 495.055509, variationPct: 0.70, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '23/03/2026', bidUsd: 458.303869, askUsd: 459.452500, rateUsd: 459.452500, rateEur: 491.614175, variationPct: 0.52, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '20/03/2026', bidUsd: 455.933011, askUsd: 457.075700, rateUsd: 457.075700, rateEur: 489.070999, variationPct: 0.40, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '18/03/2026', bidUsd: 454.116563, askUsd: 455.254700, rateUsd: 455.254700, rateEur: 487.122529, variationPct: 0.83, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '17/03/2026', bidUsd: 450.378432, askUsd: 451.507200, rateUsd: 451.507200, rateEur: 483.112704, variationPct: 0.70, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '16/03/2026', bidUsd: 447.247679, askUsd: 448.368600, rateUsd: 448.368600, rateEur: 479.754402, variationPct: 0.35, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '13/03/2026', bidUsd: 445.687788, askUsd: 446.804800, rateUsd: 446.804800, rateEur: 478.081136, variationPct: 0.80, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '12/03/2026', bidUsd: 442.150553, askUsd: 443.258700, rateUsd: 443.258700, rateEur: 474.286809, variationPct: 0.52, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '11/03/2026', bidUsd: 439.863286, askUsd: 440.965700, rateUsd: 440.965700, rateEur: 471.833299, variationPct: 0.63, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '10/03/2026', bidUsd: 437.109488, askUsd: 438.205000, rateUsd: 438.205000, rateEur: 468.879350, variationPct: 0.45, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '09/03/2026', bidUsd: 435.151295, askUsd: 436.241900, rateUsd: 436.241900, rateEur: 466.778833, variationPct: 0.71, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '06/03/2026', bidUsd: 432.083484, askUsd: 433.166400, rateUsd: 433.166400, rateEur: 463.488048, variationPct: 0.50, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '05/03/2026', bidUsd: 429.933772, askUsd: 431.011300, rateUsd: 431.011300, rateEur: 461.182091, variationPct: 0.72, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '04/03/2026', bidUsd: 426.860375, askUsd: 427.930200, rateUsd: 427.930200, rateEur: 457.885314, variationPct: 0.53, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '03/03/2026', bidUsd: 424.609915, askUsd: 425.674100, rateUsd: 425.674100, rateEur: 455.471287, variationPct: 0.90, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '02/03/2026', bidUsd: 420.822507, askUsd: 421.877200, rateUsd: 421.877200, rateEur: 451.408604, variationPct: 0.45, source: 'Banco Central de Venezuela / Mesa Cambiaria' },

  // FEBRERO 2026
  { date: '27/02/2026', bidUsd: 418.937332, askUsd: 419.987300, rateUsd: 419.987300, rateEur: 449.386411, variationPct: 0.63, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '26/02/2026', bidUsd: 416.314505, askUsd: 417.357900, rateUsd: 417.357900, rateEur: 446.572953, variationPct: 0.80, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '25/02/2026', bidUsd: 413.010386, askUsd: 414.045500, rateUsd: 414.045500, rateEur: 443.028685, variationPct: 0.72, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '24/02/2026', bidUsd: 410.057986, askUsd: 411.085700, rateUsd: 411.085700, rateEur: 439.861699, variationPct: 0.91, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '23/02/2026', bidUsd: 406.360154, askUsd: 407.378600, rateUsd: 407.378600, rateEur: 435.895102, variationPct: 0.50, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '20/02/2026', bidUsd: 404.338421, askUsd: 405.351800, rateUsd: 405.351800, rateEur: 433.726426, variationPct: 0.75, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '19/02/2026', bidUsd: 401.328464, askUsd: 402.334300, rateUsd: 402.334300, rateEur: 430.497701, variationPct: 0.90, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '18/02/2026', bidUsd: 397.748736, askUsd: 398.745600, rateUsd: 398.745600, rateEur: 426.657792, variationPct: 0.60, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '13/02/2026', bidUsd: 395.376482, askUsd: 396.367400, rateUsd: 396.367400, rateEur: 424.113118, variationPct: 0.80, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '12/02/2026', bidUsd: 392.238546, askUsd: 393.221600, rateUsd: 393.221600, rateEur: 420.747112, variationPct: 0.75, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '11/02/2026', bidUsd: 389.318664, askUsd: 390.294400, rateUsd: 390.294400, rateEur: 417.615008, variationPct: 0.66, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '10/02/2026', bidUsd: 387.767552, askUsd: 388.739400, rateUsd: 388.739400, rateEur: 415.951158, variationPct: 0.90, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '09/02/2026', bidUsd: 384.308820, askUsd: 385.272000, rateUsd: 385.272000, rateEur: 412.241040, variationPct: 0.69, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '06/02/2026', bidUsd: 381.675221, askUsd: 382.631800, rateUsd: 382.631800, rateEur: 409.416026, variationPct: 0.40, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '05/02/2026', bidUsd: 380.154632, askUsd: 381.107400, rateUsd: 381.107400, rateEur: 407.784918, variationPct: 0.70, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '04/02/2026', bidUsd: 377.512055, askUsd: 378.458200, rateUsd: 378.458200, rateEur: 404.950274, variationPct: 0.90, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '03/02/2026', bidUsd: 374.144794, askUsd: 375.082500, rateUsd: 375.082500, rateEur: 401.338275, variationPct: 0.80, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '02/02/2026', bidUsd: 371.175436, askUsd: 372.105700, rateUsd: 372.105700, rateEur: 398.153099, variationPct: 0.49, source: 'Banco Central de Venezuela / Mesa Cambiaria' },

  // ENERO 2026
  { date: '30/01/2026', bidUsd: 369.328764, askUsd: 370.254400, rateUsd: 370.254400, rateEur: 396.172208, variationPct: 0.80, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '29/01/2026', bidUsd: 366.388633, askUsd: 367.306900, rateUsd: 367.306900, rateEur: 393.018383, variationPct: 1.01, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '28/01/2026', bidUsd: 362.753144, askUsd: 363.662300, rateUsd: 363.662300, rateEur: 389.118661, variationPct: 0.60, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '27/01/2026', bidUsd: 360.586874, askUsd: 361.490600, rateUsd: 361.490600, rateEur: 386.794942, variationPct: 0.71, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '26/01/2026', bidUsd: 358.027388, askUsd: 358.924700, rateUsd: 358.924700, rateEur: 384.049429, variationPct: 0.94, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '23/01/2026', bidUsd: 354.663918, askUsd: 355.552800, rateUsd: 355.552800, rateEur: 380.441496, variationPct: 0.81, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '22/01/2026', bidUsd: 351.824534, askUsd: 352.706300, rateUsd: 352.706300, rateEur: 377.395741, variationPct: 0.80, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '21/01/2026', bidUsd: 349.052382, askUsd: 349.927200, rateUsd: 349.927200, rateEur: 374.422104, variationPct: 0.77, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '20/01/2026', bidUsd: 346.394942, askUsd: 347.263100, rateUsd: 347.263100, rateEur: 371.571517, variationPct: 0.80, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '16/01/2026', bidUsd: 343.645832, askUsd: 344.507100, rateUsd: 344.507100, rateEur: 368.622597, variationPct: 0.81, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '15/01/2026', bidUsd: 340.888144, askUsd: 341.742500, rateUsd: 341.742500, rateEur: 365.664475, variationPct: 0.77, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '14/01/2026', bidUsd: 338.301626, askUsd: 339.149500, rateUsd: 339.149500, rateEur: 362.889965, variationPct: 0.80, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '13/01/2026', bidUsd: 335.618451, askUsd: 336.459600, rateUsd: 336.459600, rateEur: 360.011772, variationPct: 1.83, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '09/01/2026', bidUsd: 329.549162, askUsd: 330.375100, rateUsd: 330.375100, rateEur: 353.501357, variationPct: 1.54, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '08/01/2026', bidUsd: 324.575927, askUsd: 325.389400, rateUsd: 325.389400, rateEur: 348.166658, variationPct: 1.36, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '07/01/2026', bidUsd: 320.229719, askUsd: 321.032300, rateUsd: 321.032300, rateEur: 343.504561, variationPct: 2.93, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '06/01/2026', bidUsd: 311.101697, askUsd: 311.881400, rateUsd: 311.881400, rateEur: 333.713098, variationPct: 1.21, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '05/01/2026', bidUsd: 307.384214, askUsd: 308.154600, rateUsd: 308.154600, rateEur: 329.725422, variationPct: 1.14, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
  { date: '02/01/2026', bidUsd: 303.917901, askUsd: 304.679600, rateUsd: 304.679600, rateEur: 326.007172, variationPct: 0.00, source: 'Banco Central de Venezuela / Mesa Cambiaria' },
];

export const CURRENT_BCV_RATE = BCV_RATES_HISTORY[0];

export interface DashboardMetric {
  title: string;
  valueVES: string;
  valueUSD: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

export const FINANCIAL_METRICS: DashboardMetric[] = [
  {
    title: 'Disponibilidad Bancaria Banesco (VES)',
    valueVES: 'Bs. 0.00',
    valueUSD: '$ 0.00',
    change: 'Base de datos limpia',
    trend: 'neutral',
    description: 'Listo para cargar extracto bancario de Cta 0134-0342-19-3421049281'
  },
  {
    title: 'Cuenta Custodia Moneda Extranjera (USD)',
    valueVES: 'Bs. 0.00',
    valueUSD: '$ 0.00',
    change: 'A la espera de datos',
    trend: 'neutral',
    description: 'Listo para registrar depósitos reales Convenio 20'
  },
  {
    title: 'Volumen de Café Acopiado y Facturado Q1',
    valueVES: 'Bs. 0.00',
    valueUSD: '$ 0.00',
    change: '0 Quintales registrados',
    trend: 'neutral',
    description: 'Listo para registrar lotes reales de café'
  },
  {
    title: 'Nómina Operativa & Vigilancia Mensual',
    valueVES: 'Bs. 0.00',
    valueUSD: '$ 0.00',
    change: '0 Trabajadores',
    trend: 'neutral',
    description: 'Listo para ingresar nómina real'
  }
];
