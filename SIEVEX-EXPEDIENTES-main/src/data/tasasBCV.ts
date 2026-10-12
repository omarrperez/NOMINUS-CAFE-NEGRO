export interface TasaBCVItem {
  fecha: string;        // Formato DD/MM/YYYY
  fechaIso: string;     // Formato YYYY-MM-DD
  moneda: string;       // USD E.U.A.
  compraBid: number;    // Tasa de compra bancaria
  ventaAsk: number;     // Tasa de venta oficial en Mesa de Cambio BCV
}

// Historial Oficial de Tasas de Cambio BCV (Enero 2026 a Agosto 2026) suministrado por el usuario
export const HISTORIAL_TASAS_BCV_2026: TasaBCVItem[] = [
  { fecha: "02/01/2026", fechaIso: "2026-01-02", moneda: "USD E.U.A.", compraBid: 303.917901, ventaAsk: 304.679600 },
  { fecha: "05/01/2026", fechaIso: "2026-01-05", moneda: "USD E.U.A.", compraBid: 307.384214, ventaAsk: 308.154600 },
  { fecha: "06/01/2026", fechaIso: "2026-01-06", moneda: "USD E.U.A.", compraBid: 311.101697, ventaAsk: 311.881400 },
  { fecha: "07/01/2026", fechaIso: "2026-01-07", moneda: "USD E.U.A.", compraBid: 320.229719, ventaAsk: 321.032300 },
  { fecha: "08/01/2026", fechaIso: "2026-01-08", moneda: "USD E.U.A.", compraBid: 324.575927, ventaAsk: 325.389400 },
  { fecha: "09/01/2026", fechaIso: "2026-01-09", moneda: "USD E.U.A.", compraBid: 329.549162, ventaAsk: 330.375100 },
  { fecha: "13/01/2026", fechaIso: "2026-01-13", moneda: "USD E.U.A.", compraBid: 335.618451, ventaAsk: 336.459600 },
  { fecha: "14/01/2026", fechaIso: "2026-01-14", moneda: "USD E.U.A.", compraBid: 338.301626, ventaAsk: 339.149500 },
  { fecha: "15/01/2026", fechaIso: "2026-01-15", moneda: "USD E.U.A.", compraBid: 340.888144, ventaAsk: 341.742500 },
  { fecha: "16/01/2026", fechaIso: "2026-01-16", moneda: "USD E.U.A.", compraBid: 343.645832, ventaAsk: 344.507100 },
  { fecha: "20/01/2026", fechaIso: "2026-01-20", moneda: "USD E.U.A.", compraBid: 346.394942, ventaAsk: 347.263100 },
  { fecha: "21/01/2026", fechaIso: "2026-01-21", moneda: "USD E.U.A.", compraBid: 349.052382, ventaAsk: 349.927200 },
  { fecha: "22/01/2026", fechaIso: "2026-01-22", moneda: "USD E.U.A.", compraBid: 351.824534, ventaAsk: 352.706300 },
  { fecha: "23/01/2026", fechaIso: "2026-01-23", moneda: "USD E.U.A.", compraBid: 354.663918, ventaAsk: 355.552800 },
  { fecha: "26/01/2026", fechaIso: "2026-01-26", moneda: "USD E.U.A.", compraBid: 358.027388, ventaAsk: 358.924700 },
  { fecha: "27/01/2026", fechaIso: "2026-01-27", moneda: "USD E.U.A.", compraBid: 360.586874, ventaAsk: 361.490600 },
  { fecha: "28/01/2026", fechaIso: "2026-01-28", moneda: "USD E.U.A.", compraBid: 362.753144, ventaAsk: 363.662300 },
  { fecha: "29/01/2026", fechaIso: "2026-01-29", moneda: "USD E.U.A.", compraBid: 366.388633, ventaAsk: 367.306900 },
  { fecha: "30/01/2026", fechaIso: "2026-01-30", moneda: "USD E.U.A.", compraBid: 369.328764, ventaAsk: 370.254400 },
  { fecha: "02/02/2026", fechaIso: "2026-02-02", moneda: "USD E.U.A.", compraBid: 371.175436, ventaAsk: 372.105700 },
  { fecha: "03/02/2026", fechaIso: "2026-02-03", moneda: "USD E.U.A.", compraBid: 374.144794, ventaAsk: 375.082500 },
  { fecha: "04/02/2026", fechaIso: "2026-02-04", moneda: "USD E.U.A.", compraBid: 377.512055, ventaAsk: 378.458200 },
  { fecha: "05/02/2026", fechaIso: "2026-02-05", moneda: "USD E.U.A.", compraBid: 380.154632, ventaAsk: 381.107400 },
  { fecha: "06/02/2026", fechaIso: "2026-02-06", moneda: "USD E.U.A.", compraBid: 381.675221, ventaAsk: 382.631800 },
  { fecha: "09/02/2026", fechaIso: "2026-02-09", moneda: "USD E.U.A.", compraBid: 384.308820, ventaAsk: 385.272000 },
  { fecha: "10/02/2026", fechaIso: "2026-02-10", moneda: "USD E.U.A.", compraBid: 387.767552, ventaAsk: 388.739400 },
  { fecha: "11/02/2026", fechaIso: "2026-02-11", moneda: "USD E.U.A.", compraBid: 389.318664, ventaAsk: 390.294400 },
  { fecha: "12/02/2026", fechaIso: "2026-02-12", moneda: "USD E.U.A.", compraBid: 392.238546, ventaAsk: 393.221600 },
  { fecha: "13/02/2026", fechaIso: "2026-02-13", moneda: "USD E.U.A.", compraBid: 395.376482, ventaAsk: 396.367400 },
  { fecha: "18/02/2026", fechaIso: "2026-02-18", moneda: "USD E.U.A.", compraBid: 397.748736, ventaAsk: 398.745600 },
  { fecha: "19/02/2026", fechaIso: "2026-02-19", moneda: "USD E.U.A.", compraBid: 401.328464, ventaAsk: 402.334300 },
  { fecha: "20/02/2026", fechaIso: "2026-02-20", moneda: "USD E.U.A.", compraBid: 404.338421, ventaAsk: 405.351800 },
  { fecha: "23/02/2026", fechaIso: "2026-02-23", moneda: "USD E.U.A.", compraBid: 406.360154, ventaAsk: 407.378600 },
  { fecha: "24/02/2026", fechaIso: "2026-02-24", moneda: "USD E.U.A.", compraBid: 410.057986, ventaAsk: 411.085700 },
  { fecha: "25/02/2026", fechaIso: "2026-02-25", moneda: "USD E.U.A.", compraBid: 413.010386, ventaAsk: 414.045500 },
  { fecha: "26/02/2026", fechaIso: "2026-02-26", moneda: "USD E.U.A.", compraBid: 416.314505, ventaAsk: 417.357900 },
  { fecha: "27/02/2026", fechaIso: "2026-02-27", moneda: "USD E.U.A.", compraBid: 418.937332, ventaAsk: 419.987300 },
  { fecha: "02/03/2026", fechaIso: "2026-03-02", moneda: "USD E.U.A.", compraBid: 420.822507, ventaAsk: 421.877200 },
  { fecha: "03/03/2026", fechaIso: "2026-03-03", moneda: "USD E.U.A.", compraBid: 424.609915, ventaAsk: 425.674100 },
  { fecha: "04/03/2026", fechaIso: "2026-03-04", moneda: "USD E.U.A.", compraBid: 426.860375, ventaAsk: 427.930200 },
  { fecha: "05/03/2026", fechaIso: "2026-03-05", moneda: "USD E.U.A.", compraBid: 429.933772, ventaAsk: 431.011300 },
  { fecha: "06/03/2026", fechaIso: "2026-03-06", moneda: "USD E.U.A.", compraBid: 432.083484, ventaAsk: 433.166400 },
  { fecha: "09/03/2026", fechaIso: "2026-03-09", moneda: "USD E.U.A.", compraBid: 435.151295, ventaAsk: 436.241900 },
  { fecha: "10/03/2026", fechaIso: "2026-03-10", moneda: "USD E.U.A.", compraBid: 437.109488, ventaAsk: 438.205000 },
  { fecha: "11/03/2026", fechaIso: "2026-03-11", moneda: "USD E.U.A.", compraBid: 439.863286, ventaAsk: 440.965700 },
  { fecha: "12/03/2026", fechaIso: "2026-03-12", moneda: "USD E.U.A.", compraBid: 442.150553, ventaAsk: 443.258700 },
  { fecha: "13/03/2026", fechaIso: "2026-03-13", moneda: "USD E.U.A.", compraBid: 445.687788, ventaAsk: 446.804800 },
  { fecha: "16/03/2026", fechaIso: "2026-03-16", moneda: "USD E.U.A.", compraBid: 447.247679, ventaAsk: 448.368600 },
  { fecha: "17/03/2026", fechaIso: "2026-03-17", moneda: "USD E.U.A.", compraBid: 450.378432, ventaAsk: 451.507200 },
  { fecha: "18/03/2026", fechaIso: "2026-03-18", moneda: "USD E.U.A.", compraBid: 454.116563, ventaAsk: 455.254700 },
  { fecha: "20/03/2026", fechaIso: "2026-03-20", moneda: "USD E.U.A.", compraBid: 455.933011, ventaAsk: 457.075700 },
  { fecha: "23/03/2026", fechaIso: "2026-03-23", moneda: "USD E.U.A.", compraBid: 458.303869, ventaAsk: 459.452500 },
  { fecha: "24/03/2026", fechaIso: "2026-03-24", moneda: "USD E.U.A.", compraBid: 461.512028, ventaAsk: 462.668700 },
  { fecha: "25/03/2026", fechaIso: "2026-03-25", moneda: "USD E.U.A.", compraBid: 465.434897, ventaAsk: 466.601400 },
  { fecha: "26/03/2026", fechaIso: "2026-03-26", moneda: "USD E.U.A.", compraBid: 467.343214, ventaAsk: 468.514500 },
  { fecha: "27/03/2026", fechaIso: "2026-03-27", moneda: "USD E.U.A.", compraBid: 470.521149, ventaAsk: 471.700400 },
  { fecha: "30/03/2026", fechaIso: "2026-03-30", moneda: "USD E.U.A.", compraBid: 472.685525, ventaAsk: 473.870200 },
  { fecha: "31/03/2026", fechaIso: "2026-03-31", moneda: "USD E.U.A.", compraBid: 472.732806, ventaAsk: 473.917600 },
  { fecha: "01/04/2026", fechaIso: "2026-04-01", moneda: "USD E.U.A.", compraBid: 472.874651, ventaAsk: 474.059800 },
  { fecha: "06/04/2026", fechaIso: "2026-04-06", moneda: "USD E.U.A.", compraBid: 473.347466, ventaAsk: 474.533800 },
  { fecha: "07/04/2026", fechaIso: "2026-04-07", moneda: "USD E.U.A.", compraBid: 473.820779, ventaAsk: 475.008300 },
  { fecha: "08/04/2026", fechaIso: "2026-04-08", moneda: "USD E.U.A.", compraBid: 474.768404, ventaAsk: 475.958300 },
  { fecha: "09/04/2026", fechaIso: "2026-04-09", moneda: "USD E.U.A.", compraBid: 475.243115, ventaAsk: 476.434200 },
  { fecha: "10/04/2026", fechaIso: "2026-04-10", moneda: "USD E.U.A.", compraBid: 475.955928, ventaAsk: 477.148800 },
  { fecha: "13/04/2026", fechaIso: "2026-04-13", moneda: "USD E.U.A.", compraBid: 476.431835, ventaAsk: 477.625900 },
  { fecha: "14/04/2026", fechaIso: "2026-04-14", moneda: "USD E.U.A.", compraBid: 477.384647, ventaAsk: 478.581100 },
  { fecha: "15/04/2026", fechaIso: "2026-04-15", moneda: "USD E.U.A.", compraBid: 478.578056, ventaAsk: 479.777500 },
  { fecha: "16/04/2026", fechaIso: "2026-04-16", moneda: "USD E.U.A.", compraBid: 479.056557, ventaAsk: 480.257200 },
  { fecha: "17/04/2026", fechaIso: "2026-04-17", moneda: "USD E.U.A.", compraBid: 480.014656, ventaAsk: 481.217700 },
  { fecha: "20/04/2026", fechaIso: "2026-04-20", moneda: "USD E.U.A.", compraBid: 480.494653, ventaAsk: 481.698900 },
  { fecha: "21/04/2026", fechaIso: "2026-04-21", moneda: "USD E.U.A.", compraBid: 481.551704, ventaAsk: 482.758600 },
  { fecha: "22/04/2026", fechaIso: "2026-04-22", moneda: "USD E.U.A.", compraBid: 482.129555, ventaAsk: 483.337900 },
  { fecha: "23/04/2026", fechaIso: "2026-04-23", moneda: "USD E.U.A.", compraBid: 482.659826, ventaAsk: 483.869500 },
  { fecha: "24/04/2026", fechaIso: "2026-04-24", moneda: "USD E.U.A.", compraBid: 483.528549, ventaAsk: 484.740400 },
  { fecha: "27/04/2026", fechaIso: "2026-04-27", moneda: "USD E.U.A.", compraBid: 484.012037, ventaAsk: 485.225100 },
  { fecha: "28/04/2026", fechaIso: "2026-04-28", moneda: "USD E.U.A.", compraBid: 484.980011, ventaAsk: 486.195500 },
  { fecha: "29/04/2026", fechaIso: "2026-04-29", moneda: "USD E.U.A.", compraBid: 485.901402, ventaAsk: 487.119200 },
  { fecha: "30/04/2026", fechaIso: "2026-04-30", moneda: "USD E.U.A.", compraBid: 488.330813, ventaAsk: 489.554700 },
  { fecha: "04/05/2026", fechaIso: "2026-05-04", moneda: "USD E.U.A.", compraBid: 488.819090, ventaAsk: 490.044200 },
  { fecha: "05/05/2026", fechaIso: "2026-05-05", moneda: "USD E.U.A.", compraBid: 492.143059, ventaAsk: 493.376500 },
  { fecha: "06/05/2026", fechaIso: "2026-05-06", moneda: "USD E.U.A.", compraBid: 495.588025, ventaAsk: 496.830100 },
  { fecha: "07/05/2026", fechaIso: "2026-05-07", moneda: "USD E.U.A.", compraBid: 498.611148, ventaAsk: 499.860800 },
  { fecha: "08/05/2026", fechaIso: "2026-05-08", moneda: "USD E.U.A.", compraBid: 499.209449, ventaAsk: 500.460600 },
  { fecha: "11/05/2026", fechaIso: "2026-05-11", moneda: "USD E.U.A.", compraBid: 503.652314, ventaAsk: 504.914600 },
  { fecha: "12/05/2026", fechaIso: "2026-05-12", moneda: "USD E.U.A.", compraBid: 507.328899, ventaAsk: 508.600400 },
  { fecha: "13/05/2026", fechaIso: "2026-05-13", moneda: "USD E.U.A.", compraBid: 509.510332, ventaAsk: 510.787300 },
  { fecha: "14/05/2026", fechaIso: "2026-05-14", moneda: "USD E.U.A.", compraBid: 513.892050, ventaAsk: 515.180000 },
  { fecha: "15/05/2026", fechaIso: "2026-05-15", moneda: "USD E.U.A.", compraBid: 516.666995, ventaAsk: 517.961900 },
  { fecha: "19/05/2026", fechaIso: "2026-05-19", moneda: "USD E.U.A.", compraBid: 519.611915, ventaAsk: 520.914200 },
  { fecha: "20/05/2026", fechaIso: "2026-05-20", moneda: "USD E.U.A.", compraBid: 522.365813, ventaAsk: 523.675000 },
  { fecha: "21/05/2026", fechaIso: "2026-05-21", moneda: "USD E.U.A.", compraBid: 525.552227, ventaAsk: 526.869400 },
  { fecha: "22/05/2026", fechaIso: "2026-05-22", moneda: "USD E.U.A.", compraBid: 529.178438, ventaAsk: 530.504700 },
  { fecha: "25/05/2026", fechaIso: "2026-05-25", moneda: "USD E.U.A.", compraBid: 534.046837, ventaAsk: 535.385300 },
  { fecha: "26/05/2026", fechaIso: "2026-05-26", moneda: "USD E.U.A.", compraBid: 538.692992, ventaAsk: 540.043100 },
  { fecha: "27/05/2026", fechaIso: "2026-05-27", moneda: "USD E.U.A.", compraBid: 543.217952, ventaAsk: 544.579400 },
  { fecha: "28/05/2026", fechaIso: "2026-05-28", moneda: "USD E.U.A.", compraBid: 547.998171, ventaAsk: 549.371600 },
  { fecha: "29/05/2026", fechaIso: "2026-05-29", moneda: "USD E.U.A.", compraBid: 553.039736, ventaAsk: 554.425800 },
  { fecha: "01/06/2026", fechaIso: "2026-06-01", moneda: "USD E.U.A.", compraBid: 556.579165, ventaAsk: 557.974100 },
  { fecha: "02/06/2026", fechaIso: "2026-06-02", moneda: "USD E.U.A.", compraBid: 557.246991, ventaAsk: 558.643600 },
  { fecha: "03/06/2026", fechaIso: "2026-06-03", moneda: "USD E.U.A.", compraBid: 558.974362, ventaAsk: 560.375300 },
  { fecha: "04/06/2026", fechaIso: "2026-06-04", moneda: "USD E.U.A.", compraBid: 561.880977, ventaAsk: 563.289200 },
  { fecha: "05/06/2026", fechaIso: "2026-06-05", moneda: "USD E.U.A.", compraBid: 566.263593, ventaAsk: 567.682800 },
  { fecha: "09/06/2026", fechaIso: "2026-06-09", moneda: "USD E.U.A.", compraBid: 571.246704, ventaAsk: 572.678400 },
  { fecha: "10/06/2026", fechaIso: "2026-06-10", moneda: "USD E.U.A.", compraBid: 576.102235, ventaAsk: 577.546100 },
  { fecha: "11/06/2026", fechaIso: "2026-06-11", moneda: "USD E.U.A.", compraBid: 581.229485, ventaAsk: 582.686200 },
  { fecha: "12/06/2026", fechaIso: "2026-06-12", moneda: "USD E.U.A.", compraBid: 585.937385, ventaAsk: 587.405900 },
  { fecha: "15/06/2026", fechaIso: "2026-06-15", moneda: "USD E.U.A.", compraBid: 591.035009, ventaAsk: 592.516300 },
  { fecha: "16/06/2026", fechaIso: "2026-06-16", moneda: "USD E.U.A.", compraBid: 595.290444, ventaAsk: 596.782400 },
  { fecha: "17/06/2026", fechaIso: "2026-06-17", moneda: "USD E.U.A.", compraBid: 600.826569, ventaAsk: 602.332400 },
  { fecha: "18/06/2026", fechaIso: "2026-06-18", moneda: "USD E.U.A.", compraBid: 605.873420, ventaAsk: 607.391900 },
  { fecha: "19/06/2026", fechaIso: "2026-06-19", moneda: "USD E.U.A.", compraBid: 610.902117, ventaAsk: 612.433200 },
  { fecha: "22/06/2026", fechaIso: "2026-06-22", moneda: "USD E.U.A.", compraBid: 616.094703, ventaAsk: 617.638800 },
  { fecha: "23/06/2026", fechaIso: "2026-06-23", moneda: "USD E.U.A.", compraBid: 619.976075, ventaAsk: 621.529900 },
  { fecha: "25/06/2026", fechaIso: "2026-06-25", moneda: "USD E.U.A.", compraBid: 620.657966, ventaAsk: 622.213500 },
  { fecha: "26/06/2026", fechaIso: "2026-06-26", moneda: "USD E.U.A.", compraBid: 621.464744, ventaAsk: 623.022300 },
  { fecha: "30/06/2026", fechaIso: "2026-06-30", moneda: "USD E.U.A.", compraBid: 631.780989, ventaAsk: 633.364400 },
  { fecha: "01/07/2026", fechaIso: "2026-07-01", moneda: "USD E.U.A.", compraBid: 638.103643, ventaAsk: 639.702900 },
  { fecha: "02/07/2026", fechaIso: "2026-07-02", moneda: "USD E.U.A.", compraBid: 651.340169, ventaAsk: 652.972600 },
  { fecha: "03/07/2026", fechaIso: "2026-07-03", moneda: "USD E.U.A.", compraBid: 665.382375, ventaAsk: 667.050000 },
  { fecha: "06/07/2026", fechaIso: "2026-07-06", moneda: "USD E.U.A.", compraBid: 673.243174, ventaAsk: 674.930500 },
  { fecha: "07/07/2026", fechaIso: "2026-07-07", moneda: "USD E.U.A.", compraBid: 684.227843, ventaAsk: 685.942700 },
  { fecha: "08/07/2026", fechaIso: "2026-07-08", moneda: "USD E.U.A.", compraBid: 698.474338, ventaAsk: 700.224900 },
  { fecha: "09/07/2026", fechaIso: "2026-07-09", moneda: "USD E.U.A.", compraBid: 707.919266, ventaAsk: 709.693500 },
  { fecha: "10/07/2026", fechaIso: "2026-07-10", moneda: "USD E.U.A.", compraBid: 719.542236, ventaAsk: 721.345600 },
  { fecha: "13/07/2026", fechaIso: "2026-07-13", moneda: "USD E.U.A.", compraBid: 722.189003, ventaAsk: 723.999000 },
  { fecha: "14/07/2026", fechaIso: "2026-07-14", moneda: "USD E.U.A.", compraBid: 723.932633, ventaAsk: 725.747000 },
  { fecha: "15/07/2026", fechaIso: "2026-07-15", moneda: "USD E.U.A.", compraBid: 725.632572, ventaAsk: 727.451200 },
  { fecha: "16/07/2026", fechaIso: "2026-07-16", moneda: "USD E.U.A.", compraBid: 730.647503, ventaAsk: 732.478700 },
  { fecha: "17/07/2026", fechaIso: "2026-07-17", moneda: "USD E.U.A.", compraBid: 735.091565, ventaAsk: 736.933900 },
  { fecha: "20/07/2026", fechaIso: "2026-07-20", moneda: "USD E.U.A.", compraBid: 735.389020, ventaAsk: 737.232100 },
  { fecha: "21/07/2026", fechaIso: "2026-07-21", moneda: "USD E.U.A.", compraBid: 735.389020, ventaAsk: 737.232100 },
  { fecha: "22/07/2026", fechaIso: "2026-07-22", moneda: "USD E.U.A.", compraBid: 736.036896, ventaAsk: 737.881600 },
  { fecha: "23/07/2026", fechaIso: "2026-07-23", moneda: "USD E.U.A.", compraBid: 740.373627, ventaAsk: 742.229200 },
  { fecha: "27/07/2026", fechaIso: "2026-07-27", moneda: "USD E.U.A.", compraBid: 740.953474, ventaAsk: 742.810500 },
  { fecha: "28/07/2026", fechaIso: "2026-07-28", moneda: "USD E.U.A.", compraBid: 742.365834, ventaAsk: 744.226400 },
  { fecha: "29/07/2026", fechaIso: "2026-07-29", moneda: "USD E.U.A.", compraBid: 743.773007, ventaAsk: 745.637100 },
  { fecha: "30/07/2026", fechaIso: "2026-07-30", moneda: "USD E.U.A.", compraBid: 744.763126, ventaAsk: 746.629700 },
  { fecha: "31/07/2026", fechaIso: "2026-07-31", moneda: "USD E.U.A.", compraBid: 746.914434, ventaAsk: 748.786400 },
  { fecha: "03/08/2026", fechaIso: "2026-08-03", moneda: "USD E.U.A.", compraBid: 750.214064, ventaAsk: 752.094300 },
  { fecha: "04/08/2026", fechaIso: "2026-08-04", moneda: "USD E.U.A.", compraBid: 753.267312, ventaAsk: 755.155200 },
  { fecha: "05/08/2026", fechaIso: "2026-08-05", moneda: "USD E.U.A.", compraBid: 754.010350, ventaAsk: 755.900100 },
  { fecha: "06/08/2026", fechaIso: "2026-08-06", moneda: "USD E.U.A.", compraBid: 754.816529, ventaAsk: 756.708300 },
  { fecha: "07/08/2026", fechaIso: "2026-08-07", moneda: "USD E.U.A.", compraBid: 755.646749, ventaAsk: 757.540600 },
  { fecha: "10/08/2026", fechaIso: "2026-08-10", moneda: "USD E.U.A.", compraBid: 759.313658, ventaAsk: 761.216700 },
  { fecha: "11/08/2026", fechaIso: "2026-08-11", moneda: "USD E.U.A.", compraBid: 762.437729, ventaAsk: 764.348600 },
  { fecha: "12/08/2026", fechaIso: "2026-08-12", moneda: "USD E.U.A.", compraBid: 764.943149, ventaAsk: 766.860300 },
  { fecha: "13/08/2026", fechaIso: "2026-08-13", moneda: "USD E.U.A.", compraBid: 769.143722, ventaAsk: 771.071400 },
  { fecha: "14/08/2026", fechaIso: "2026-08-14", moneda: "USD E.U.A.", compraBid: 770.612740, ventaAsk: 772.544100 },
  { fecha: "17/08/2026", fechaIso: "2026-08-17", moneda: "USD E.U.A.", compraBid: 771.379219, ventaAsk: 773.312500 },
  { fecha: "18/08/2026", fechaIso: "2026-08-18", moneda: "USD E.U.A.", compraBid: 773.397261, ventaAsk: 775.335600 },
  { fecha: "19/08/2026", fechaIso: "2026-08-19", moneda: "USD E.U.A.", compraBid: 775.472560, ventaAsk: 777.416100 },
  { fecha: "20/08/2026", fechaIso: "2026-08-20", moneda: "USD E.U.A.", compraBid: 778.002320, ventaAsk: 779.952200 },
  { fecha: "21/08/2026", fechaIso: "2026-08-21", moneda: "USD E.U.A.", compraBid: 782.701642, ventaAsk: 784.663300 },
  { fecha: "24/08/2026", fechaIso: "2026-08-24", moneda: "USD E.U.A.", compraBid: 783.106627, ventaAsk: 785.069300 },
  { fecha: "25/08/2026", fechaIso: "2026-08-25", moneda: "USD E.U.A.", compraBid: 785.550801, ventaAsk: 787.519600 },
  { fecha: "26/08/2026", fechaIso: "2026-08-26", moneda: "USD E.U.A.", compraBid: 789.346488, ventaAsk: 791.324800 },
  { fecha: "27/08/2026", fechaIso: "2026-08-27", moneda: "USD E.U.A.", compraBid: 789.687533, ventaAsk: 791.666700 },
  { fecha: "28/08/2026", fechaIso: "2026-08-28", moneda: "USD E.U.A.", compraBid: 793.004221, ventaAsk: 794.991700 },
  { fecha: "31/08/2026", fechaIso: "2026-08-31", moneda: "USD E.U.A.", compraBid: 796.330185, ventaAsk: 798.326000 }
];

// Mapas indexados para búsqueda rápida O(1)
const TASAS_POR_FECHA_DMY = new Map<string, TasaBCVItem>();
const TASAS_POR_FECHA_ISO = new Map<string, TasaBCVItem>();

HISTORIAL_TASAS_BCV_2026.forEach((item) => {
  TASAS_POR_FECHA_DMY.set(item.fecha, item);
  TASAS_POR_FECHA_ISO.set(item.fechaIso, item);
});

/**
 * Normaliza cualquier formato de fecha a "YYYY-MM-DD" o "DD/MM/YYYY" y busca la tasa oficial.
 * Si la fecha exacta es fin de semana o feriado bancario, busca el día hábil bancario anterior.
 */
export const getTasaBCVPorFecha = (fechaInput: string): TasaBCVItem => {
  if (!fechaInput) {
    return HISTORIAL_TASAS_BCV_2026[HISTORIAL_TASAS_BCV_2026.length - 1];
  }

  const clean = fechaInput.trim().split('T')[0];

  // 1. Búsqueda directa por DD/MM/YYYY
  if (TASAS_POR_FECHA_DMY.has(clean)) {
    return TASAS_POR_FECHA_DMY.get(clean)!;
  }

  // 2. Búsqueda directa por YYYY-MM-DD
  if (TASAS_POR_FECHA_ISO.has(clean)) {
    return TASAS_POR_FECHA_ISO.get(clean)!;
  }

  // 3. Normalizar de DD/MM/YYYY a YYYY-MM-DD o viceversa
  let targetIso = '';
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      targetIso = `${y}-${m}-${d}`;
    }
  } else if (clean.includes('-')) {
    targetIso = clean;
  }

  if (targetIso && TASAS_POR_FECHA_ISO.has(targetIso)) {
    return TASAS_POR_FECHA_ISO.get(targetIso)!;
  }

  // 4. Si la fecha cae en fin de semana o día no bancario, buscar el día hábil inmediato anterior
  if (targetIso) {
    const prev = [...HISTORIAL_TASAS_BCV_2026]
      .filter((t) => t.fechaIso <= targetIso)
      .sort((a, b) => b.fechaIso.localeCompare(a.fechaIso));
    if (prev.length > 0) {
      return prev[0];
    }
  }

  // Valor por defecto: última tasa registrada (31/08/2026)
  return HISTORIAL_TASAS_BCV_2026[HISTORIAL_TASAS_BCV_2026.length - 1];
};

/**
 * Convierte un monto en Bolívares a USD usando la tasa oficial de la fecha dada
 */
export const convertirBsAUsd = (
  montoBs: number,
  fechaStr: string,
  tipo: 'VENTA' | 'COMPRA' = 'VENTA'
): { montoUsd: number; tasaAplicada: number; fechaTasa: string; compraBid: number; ventaAsk: number } => {
  const item = getTasaBCVPorFecha(fechaStr);
  const tasaAplicada = tipo === 'VENTA' ? item.ventaAsk : item.compraBid;
  const montoUsd = tasaAplicada > 0 ? Number((montoBs / tasaAplicada).toFixed(2)) : 0;

  return {
    montoUsd,
    tasaAplicada,
    fechaTasa: item.fecha,
    compraBid: item.compraBid,
    ventaAsk: item.ventaAsk,
  };
};
