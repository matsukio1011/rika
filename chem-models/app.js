const ATOMS = {
  H:  { symbol: "H",  name: "水素",         r: 14, light: "#ffffff", dark: "#cbd5e1", text: "#0f172a", stroke: "#333333" },
  O:  { symbol: "O",  name: "酸素",         r: 18, light: "#ff6b6b", dark: "#d63031", text: "#ffffff" },
  C:  { symbol: "C",  name: "炭素",         r: 20, light: "#4b5563", dark: "#2d3436", text: "#ffffff" },
  N:  { symbol: "N",  name: "窒素",         r: 20, light: "#38a3ff", dark: "#0984e3", text: "#ffffff" },
  Cl: { symbol: "Cl", name: "塩素",         r: 21, light: "#20e3b2", dark: "#00b894", text: "#0f172a" },
  S:  { symbol: "S",  name: "硫黄",         r: 21, light: "#ffe699", dark: "#fdcb6e", text: "#0f172a" },
  Na: { symbol: "Na", name: "ナトリウム",   r: 21, light: "#8c7ae6", dark: "#6c5ce7", text: "#ffffff" },
  Mg: { symbol: "Mg", name: "マグネシウム", r: 21, light: "#dfe6e9", dark: "#b2bec3", text: "#0f172a" },
  Fe: { symbol: "Fe", name: "鉄",           r: 23, light: "#8395a7", dark: "#636e72", text: "#ffffff" },
  Cu: { symbol: "Cu", name: "銅",           r: 23, light: "#ff9f7f", dark: "#e17055", text: "#ffffff" },
  Ag: { symbol: "Ag", name: "銀",           r: 24, light: "#f5f6fa", dark: "#b2bec3", text: "#0f172a" },
  Ca: { symbol: "Ca", name: "カルシウム",   r: 24, light: "#a8d8ff", dark: "#74b9ff", text: "#0f172a" },
  Al: { symbol: "Al", name: "アルミニウム", r: 21, light: "#ced6e0", dark: "#a4b0be", text: "#0f172a" },
  K:  { symbol: "K",  name: "カリウム",     r: 24, light: "#c7c3ff", dark: "#a29bfe", text: "#0f172a" },
  Cr: { symbol: "Cr", name: "クロム",       r: 21, light: "#6c9fd1", dark: "#487eb0", text: "#ffffff" }
};

/**
 * Molecule layout builder:
 * Each term has:
 * - name: Japanese substance name
 * - coeff: stoichiometric coefficient (1 = omitted in formula)
 * - formulaHtml: HTML string for formula
 * - count: number of molecule/unit clusters to render
 * - cols: number of columns in the cluster grid
 * - shape: array of { el, dx, dy } relative to cluster center
 */
const REACTIONS = [
  {
    id: "cucl2",
    category: "分解",
    title: "① 塩化銅の分解",
    shortFormula: "CuCl₂ → Cu + Cl₂",
    note: "塩化銅（CuCl₂）に電流を流すと、銅原子1個と塩素原子2個に分かれ、塩素原子2個が結びついて塩素分子（Cl₂）になります。",
    lhs: [
      {
        name: "塩化銅",
        coeff: 1,
        formula: "CuCl<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Cl", dx: -36, dy: 0 },
          { el: "Cu", dx: 0, dy: 0 },
          { el: "Cl", dx: 36, dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "銅",
        coeff: 1,
        formula: "Cu",
        count: 1,
        cols: 1,
        atoms: [{ el: "Cu", dx: 0, dy: 0 }]
      },
      {
        name: "塩素",
        coeff: 1,
        formula: "Cl<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Cl", dx: -17, dy: 0 },
          { el: "Cl", dx: 17, dy: 0 }
        ]
      }
    ]
  },
  {
    id: "ag2o",
    category: "分解",
    title: "② 酸化銀の分解",
    shortFormula: "2Ag₂O → 4Ag + O₂",
    note: "酸素は2個の原子が結びついた酸素分子（O₂）として発生するため、酸化銀（Ag₂O）は2セット必要になり、銀（Ag）は4個できます。",
    lhs: [
      {
        name: "酸化銀",
        coeff: 2,
        formula: "Ag<sub>2</sub>O",
        count: 2,
        cols: 1,
        atoms: [
          { el: "Ag", dx: -36, dy: 0 },
          { el: "O",  dx: 0,   dy: 0 },
          { el: "Ag", dx: 36,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "銀",
        coeff: 4,
        formula: "Ag",
        count: 4,
        cols: 2,
        atoms: [{ el: "Ag", dx: 0, dy: 0 }]
      },
      {
        name: "酸素",
        coeff: 1,
        formula: "O<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "h2o-decomp",
    category: "分解",
    title: "③ 水の電気分解",
    shortFormula: "2H₂O → 2H₂ + O₂",
    note: "水分子（H₂O）2個が分解すると、水素分子（H₂）が2個、酸素分子（O₂）が1個できます。発生する気体の体積比は 水素：酸素 ＝ 2：1 です。",
    lhs: [
      {
        name: "水",
        coeff: 2,
        formula: "H<sub>2</sub>O",
        count: 2,
        cols: 1,
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ],
    rhs: [
      {
        name: "水素",
        coeff: 2,
        formula: "H<sub>2</sub>",
        count: 2,
        cols: 1,
        atoms: [
          { el: "H", dx: -12, dy: 0 },
          { el: "H", dx: 12,  dy: 0 }
        ]
      },
      {
        name: "酸素",
        coeff: 1,
        formula: "O<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "h2-o2",
    category: "化合",
    title: "④ 水素と酸素の化合",
    shortFormula: "2H₂ + O₂ → 2H₂O",
    note: "水素分子（H₂）2個と酸素分子（O₂）1個が結びついて、水分子（H₂O）が2個できます。水の電気分解とちょうど逆の反応です。",
    lhs: [
      {
        name: "水素",
        coeff: 2,
        formula: "H<sub>2</sub>",
        count: 2,
        cols: 1,
        atoms: [
          { el: "H", dx: -12, dy: 0 },
          { el: "H", dx: 12,  dy: 0 }
        ]
      },
      {
        name: "酸素",
        coeff: 1,
        formula: "O<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "水",
        coeff: 2,
        formula: "H<sub>2</sub>O",
        count: 2,
        cols: 1,
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "fe-s",
    category: "化合",
    title: "⑤ 鉄と硫黄の化合",
    shortFormula: "Fe + S → FeS",
    note: "鉄原子1個と硫黄原子1個がそのまま1対1で結びつき、硫化鉄（FeS）になります。反応前後の原子の数はそれぞれ1個ずつです。",
    lhs: [
      {
        name: "鉄",
        coeff: 1,
        formula: "Fe",
        count: 1,
        cols: 1,
        atoms: [{ el: "Fe", dx: 0, dy: 0 }]
      },
      {
        name: "硫黄",
        coeff: 1,
        formula: "S",
        count: 1,
        cols: 1,
        atoms: [{ el: "S", dx: 0, dy: 0 }]
      }
    ],
    rhs: [
      {
        name: "硫化鉄",
        coeff: 1,
        formula: "FeS",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Fe", dx: -19, dy: 0 },
          { el: "S",  dx: 19,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "cu-o2",
    category: "化合",
    title: "⑥ 銅の酸化",
    shortFormula: "2Cu + O₂ → 2CuO",
    note: "酸素分子（O₂）は酸素原子2個でできているため、銅原子（Cu）も2個と結びついて、酸化銅（CuO）が2セットできます。",
    lhs: [
      {
        name: "銅",
        coeff: 2,
        formula: "Cu",
        count: 2,
        cols: 1,
        atoms: [{ el: "Cu", dx: 0, dy: 0 }]
      },
      {
        name: "酸素",
        coeff: 1,
        formula: "O<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "酸化銅",
        coeff: 2,
        formula: "CuO",
        count: 2,
        cols: 1,
        atoms: [
          { el: "Cu", dx: -18, dy: 0 },
          { el: "O",  dx: 18,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "mg-o2",
    category: "化合",
    title: "⑦ マグネシウムの酸化",
    shortFormula: "2Mg + O₂ → 2MgO",
    note: "マグネシウム（Mg）も銅と同じように酸素原子1個と結びつくため、酸素分子（O₂）1個に対して Mg が2個反応し、酸化マグネシウム（MgO）が2セットできます。",
    lhs: [
      {
        name: "マグネシウム",
        coeff: 2,
        formula: "Mg",
        count: 2,
        cols: 1,
        atoms: [{ el: "Mg", dx: 0, dy: 0 }]
      },
      {
        name: "酸素",
        coeff: 1,
        formula: "O<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "酸化マグネシウム",
        coeff: 2,
        formula: "MgO",
        count: 2,
        cols: 1,
        atoms: [
          { el: "Mg", dx: -18, dy: 0 },
          { el: "O",  dx: 18,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "c-o2",
    category: "化合",
    title: "⑧ 炭素の燃焼",
    shortFormula: "C + O₂ → CO₂",
    note: "炭素原子（C）1個と酸素分子（O₂）1個が結びつくと、二酸化炭素分子（CO₂）が1個できます。",
    lhs: [
      {
        name: "炭素",
        coeff: 1,
        formula: "C",
        count: 1,
        cols: 1,
        atoms: [{ el: "C", dx: 0, dy: 0 }]
      },
      {
        name: "酸素",
        coeff: 1,
        formula: "O<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "二酸化炭素",
        coeff: 1,
        formula: "CO<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -34, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "O", dx: 34,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "cuo-c",
    category: "還元",
    title: "⑨ 酸化銅と炭素の反応",
    shortFormula: "2CuO + C → 2Cu + CO₂",
    note: "炭素（C）が酸化銅（CuO）2セットから酸素原子を2個うばって二酸化炭素（CO₂）になり、酸化銅は還元されて銅（Cu）2個に戻ります。",
    lhs: [
      {
        name: "酸化銅",
        coeff: 2,
        formula: "CuO",
        count: 2,
        cols: 1,
        atoms: [
          { el: "Cu", dx: -18, dy: 0 },
          { el: "O",  dx: 18,  dy: 0 }
        ]
      },
      {
        name: "炭素",
        coeff: 1,
        formula: "C",
        count: 1,
        cols: 1,
        atoms: [{ el: "C", dx: 0, dy: 0 }]
      }
    ],
    rhs: [
      {
        name: "銅",
        coeff: 2,
        formula: "Cu",
        count: 2,
        cols: 1,
        atoms: [{ el: "Cu", dx: 0, dy: 0 }]
      },
      {
        name: "二酸化炭素",
        coeff: 1,
        formula: "CO<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -34, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "O", dx: 34,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "nahco3",
    category: "分解",
    title: "⑩ 炭酸水素ナトリウムの熱分解",
    shortFormula: "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂",
    note: "炭酸水素ナトリウム（NaHCO₃）2セットが加熱により分解し、炭酸ナトリウム（Na₂CO₃）、水（H₂O）、二酸化炭素（CO₂）の3種類に分かれます。",
    lhs: [
      {
        name: "炭酸水素ナトリウム",
        coeff: 2,
        formula: "NaHCO<sub>3</sub>",
        count: 2,
        cols: 1,
        atoms: [
          { el: "Na", dx: -32, dy: -18 },
          { el: "H",  dx: -32, dy: 16 },
          { el: "C",  dx: 4,   dy: 2 },
          { el: "O",  dx: 4,   dy: -28 },
          { el: "O",  dx: 34,  dy: -10 },
          { el: "O",  dx: 34,  dy: 20 }
        ]
      }
    ],
    rhs: [
      {
        name: "炭酸ナトリウム",
        coeff: 1,
        formula: "Na<sub>2</sub>CO<sub>3</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Na", dx: -34, dy: -18 },
          { el: "Na", dx: -34, dy: 18 },
          { el: "C",  dx: 4,   dy: 2 },
          { el: "O",  dx: 4,   dy: -28 },
          { el: "O",  dx: 34,  dy: -10 },
          { el: "O",  dx: 34,  dy: 20 }
        ]
      },
      {
        name: "水",
        coeff: 1,
        formula: "H<sub>2</sub>O",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      },
      {
        name: "二酸化炭素",
        coeff: 1,
        formula: "CO<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -34, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "O", dx: 34,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "cu-s",
    category: "化合",
    title: "⑪ 銅と硫黄の化合",
    shortFormula: "Cu + S → CuS",
    note: "銅原子1個と硫黄原子1個が1対1で結びつき、硫化銅（CuS）ができます。鉄と硫黄の化合と同じ 1：1 パターンです。",
    lhs: [
      {
        name: "銅",
        coeff: 1,
        formula: "Cu",
        count: 1,
        cols: 1,
        atoms: [{ el: "Cu", dx: 0, dy: 0 }]
      },
      {
        name: "硫黄",
        coeff: 1,
        formula: "S",
        count: 1,
        cols: 1,
        atoms: [{ el: "S", dx: 0, dy: 0 }]
      }
    ],
    rhs: [
      {
        name: "硫化銅",
        coeff: 1,
        formula: "CuS",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Cu", dx: -19, dy: 0 },
          { el: "S",  dx: 19,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "cuo-h2",
    category: "還元",
    title: "⑫ 酸化銅の水素による還元",
    shortFormula: "CuO + H₂ → Cu + H₂O",
    note: "酸化銅（CuO）から水素（H₂）が酸素原子を1個うばって水（H₂O）になり、銅（Cu）が残ります。係数がすべて1なので酸素の移動を追いやすい反応です。",
    lhs: [
      {
        name: "酸化銅",
        coeff: 1,
        formula: "CuO",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Cu", dx: -18, dy: 0 },
          { el: "O",  dx: 18,  dy: 0 }
        ]
      },
      {
        name: "水素",
        coeff: 1,
        formula: "H<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "H", dx: -12, dy: 0 },
          { el: "H", dx: 12,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "銅",
        coeff: 1,
        formula: "Cu",
        count: 1,
        cols: 1,
        atoms: [{ el: "Cu", dx: 0, dy: 0 }]
      },
      {
        name: "水",
        coeff: 1,
        formula: "H<sub>2</sub>O",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "nh3",
    category: "発展・定番",
    title: "⑬ アンモニアの合成",
    shortFormula: "N₂ + 3H₂ → 2NH₃",
    note: "窒素分子（N₂）1個と水素分子（H₂）3個が組み替わり、アンモニア分子（NH₃）が2個できます。係数「3」が登場する係数合わせの定番問題です。",
    lhs: [
      {
        name: "窒素",
        coeff: 1,
        formula: "N<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "N", dx: -17, dy: 0 },
          { el: "N", dx: 17,  dy: 0 }
        ]
      },
      {
        name: "水素",
        coeff: 3,
        formula: "H<sub>2</sub>",
        count: 3,
        cols: 2,
        atoms: [
          { el: "H", dx: -12, dy: 0 },
          { el: "H", dx: 12,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "アンモニア",
        coeff: 2,
        formula: "NH<sub>3</sub>",
        count: 2,
        cols: 1,
        atoms: [
          { el: "N", dx: 0,   dy: -10 },
          { el: "H", dx: -22, dy: 14 },
          { el: "H", dx: 0,   dy: 18 },
          { el: "H", dx: 22,  dy: 14 }
        ]
      }
    ]
  },
  {
    id: "ch4",
    category: "発展・定番",
    title: "⑭ メタンの燃焼",
    shortFormula: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    note: "メタン（CH₄）1個と酸素（O₂）2個が反応すると、C は二酸化炭素（CO₂）へ、H は水（H₂O）2個へ分かれます。",
    lhs: [
      {
        name: "メタン",
        coeff: 1,
        formula: "CH<sub>4</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "C", dx: 0,   dy: 0 },
          { el: "H", dx: 0,   dy: -28 },
          { el: "H", dx: 0,   dy: 28 },
          { el: "H", dx: -28, dy: 0 },
          { el: "H", dx: 28,  dy: 0 }
        ]
      },
      {
        name: "酸素",
        coeff: 2,
        formula: "O<sub>2</sub>",
        count: 2,
        cols: 1,
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "二酸化炭素",
        coeff: 1,
        formula: "CO<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -34, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "O", dx: 34,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 2,
        formula: "H<sub>2</sub>O",
        count: 2,
        cols: 1,
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "caco3-hcl",
    category: "発展・定番",
    title: "⑮ 石灰石と塩酸の反応",
    shortFormula: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂",
    note: "炭酸カルシウム（CaCO₃）1セットと塩化水素（HCl）2セットが反応し、塩化カルシウム・水・二酸化炭素の3種類ができます。",
    lhs: [
      {
        name: "炭酸カルシウム",
        coeff: 1,
        formula: "CaCO<sub>3</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Ca", dx: -32, dy: 0 },
          { el: "C",  dx: 6,   dy: 2 },
          { el: "O",  dx: 6,   dy: -28 },
          { el: "O",  dx: 36,  dy: -10 },
          { el: "O",  dx: 36,  dy: 20 }
        ]
      },
      {
        name: "塩酸",
        coeff: 2,
        formula: "HCl",
        count: 2,
        cols: 1,
        atoms: [
          { el: "H",  dx: -15, dy: 0 },
          { el: "Cl", dx: 15,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "塩化カルシウム",
        coeff: 1,
        formula: "CaCl<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Cl", dx: -38, dy: 0 },
          { el: "Ca", dx: 0,   dy: 0 },
          { el: "Cl", dx: 38,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 1,
        formula: "H<sub>2</sub>O",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      },
      {
        name: "二酸化炭素",
        coeff: 1,
        formula: "CO<sub>2</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "O", dx: -34, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "O", dx: 34,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "fe3o4",
    category: "発展・定番",
    title: "⑯ 鉄の燃焼（四酸化三鉄）",
    shortFormula: "3Fe + 2O₂ → Fe₃O₄",
    note: "鉄原子（Fe）3個と酸素分子（O₂）2組が結びつくと、四酸化三鉄（Fe₃O₄）が1セットできます。",
    lhs: [
      {
        name: "鉄",
        coeff: 3,
        formula: "Fe",
        count: 3,
        cols: 2,
        atoms: [{ el: "Fe", dx: 0, dy: 0 }]
      },
      {
        name: "酸素",
        coeff: 2,
        formula: "O<sub>2</sub>",
        count: 2,
        cols: 1,
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "四酸化三鉄",
        coeff: 1,
        formula: "Fe<sub>3</sub>O<sub>4</sub>",
        count: 1,
        cols: 1,
        atoms: [
          { el: "Fe", dx: -28, dy: -20 },
          { el: "Fe", dx: 0,   dy: 0 },
          { el: "Fe", dx: -28, dy: 20 },
          { el: "O",  dx: 28,  dy: -24 },
          { el: "O",  dx: 28,  dy: 24 },
          { el: "O",  dx: -2,  dy: -28 },
          { el: "O",  dx: -2,  dy: 28 }
        ]
      }
    ]
  },
  {
    id: "hs_al_o2",
    category: "高校・初級〜中級",
    title: "⑰ アルミニウムの酸化",
    shortFormula: "4Al + 3O₂ → 2Al₂O₃",
    note: "酸素（O）の数を 2 と 3 の最小公倍数「6」に揃える定番パズルです。",
    lhs: [
      {
        name: "アルミニウム",
        coeff: 4,
        formula: "Al",
        atoms: [{ el: "Al", dx: 0, dy: 0 }]
      },
      {
        name: "酸素",
        coeff: 3,
        formula: "O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "酸化アルミニウム",
        coeff: 2,
        formula: "Al<sub>2</sub>O<sub>3</sub>",
        atoms: [
          { el: "O",  dx: -36, dy: -8 },
          { el: "Al", dx: -18, dy: 8 },
          { el: "O",  dx: 0,   dy: -8 },
          { el: "Al", dx: 18,  dy: 8 },
          { el: "O",  dx: 36,  dy: -8 }
        ]
      }
    ]
  },
  {
    id: "hs_c3h8",
    category: "高校・初級〜中級",
    title: "⑱ プロパンの燃焼",
    shortFormula: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
    note: "係数が整数で収まる炭化水素の燃焼です。C と H から先に決めるのがコツです。",
    lhs: [
      {
        name: "プロパン",
        coeff: 1,
        formula: "C<sub>3</sub>H<sub>8</sub>",
        atoms: [
          { el: "C", dx: -28, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "C", dx: 28,  dy: 0 },
          { el: "H", dx: -48, dy: 0 },
          { el: "H", dx: 48,  dy: 0 },
          { el: "H", dx: -28, dy: -24 },
          { el: "H", dx: 0,   dy: -24 },
          { el: "H", dx: 28,  dy: -24 },
          { el: "H", dx: -28, dy: 24 },
          { el: "H", dx: 0,   dy: 24 },
          { el: "H", dx: 28,  dy: 24 }
        ]
      },
      {
        name: "酸素",
        coeff: 5,
        formula: "O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "二酸化炭素",
        coeff: 3,
        formula: "CO<sub>2</sub>",
        atoms: [
          { el: "O", dx: -34, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "O", dx: 34,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 4,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "hs_c2h6",
    category: "高校・初級〜中級",
    title: "⑲ エタンの燃焼",
    shortFormula: "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O",
    note: "いったん O₂ の係数が「7/2」になるため、全体を2倍して整数にする王道パターンです。",
    lhs: [
      {
        name: "エタン",
        coeff: 2,
        formula: "C<sub>2</sub>H<sub>6</sub>",
        atoms: [
          { el: "C", dx: -14, dy: 0 },
          { el: "C", dx: 14,  dy: 0 },
          { el: "H", dx: -34, dy: 0 },
          { el: "H", dx: 34,  dy: 0 },
          { el: "H", dx: -14, dy: -24 },
          { el: "H", dx: 14,  dy: -24 },
          { el: "H", dx: -14, dy: 24 },
          { el: "H", dx: 14,  dy: 24 }
        ]
      },
      {
        name: "酸素",
        coeff: 7,
        formula: "O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "二酸化炭素",
        coeff: 4,
        formula: "CO<sub>2</sub>",
        atoms: [
          { el: "O", dx: -34, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "O", dx: 34,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 6,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "hs_h2s_so2",
    category: "高校・初級〜中級",
    title: "⑳ 硫化水素と二酸化硫黄の反応",
    shortFormula: "2H₂S + SO₂ → 3S + 2H₂O",
    note: "左辺の2つの物質に含まれる硫黄（S）が、右辺で単体の S として合流します。",
    lhs: [
      {
        name: "硫化水素",
        coeff: 2,
        formula: "H<sub>2</sub>S",
        atoms: [
          { el: "S", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 14 },
          { el: "H", dx: 22,  dy: 14 }
        ]
      },
      {
        name: "二酸化硫黄",
        coeff: 1,
        formula: "SO<sub>2</sub>",
        atoms: [
          { el: "S", dx: 0,   dy: -8 },
          { el: "O", dx: -24, dy: 12 },
          { el: "O", dx: 24,  dy: 12 }
        ]
      }
    ],
    rhs: [
      {
        name: "硫黄",
        coeff: 3,
        formula: "S",
        atoms: [{ el: "S", dx: 0, dy: 0 }]
      },
      {
        name: "水",
        coeff: 2,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "hs_h2o2",
    category: "高校・初級〜中級",
    title: "㉑ 過酸化水素の分解",
    shortFormula: "2H₂O₂ → 2H₂O + O₂",
    note: "右辺の酸素（O）が H₂O と O₂ の2箇所に分かれるため、偶数合わせを意識します。",
    lhs: [
      {
        name: "過酸化水素",
        coeff: 2,
        formula: "H<sub>2</sub>O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -14, dy: -6 },
          { el: "O", dx: 14,  dy: 6 },
          { el: "H", dx: -32, dy: -16 },
          { el: "H", dx: 32,  dy: 16 }
        ]
      }
    ],
    rhs: [
      {
        name: "水",
        coeff: 2,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      },
      {
        name: "酸素",
        coeff: 1,
        formula: "O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "hs_ethanol",
    category: "高校・上級",
    title: "㉒ エタノールの燃焼",
    shortFormula: "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O",
    note: "左辺の C₂H₅OH 自体にも酸素（O）が1個入っているのを数え忘れないよう注意！",
    lhs: [
      {
        name: "エタノール",
        coeff: 1,
        formula: "C<sub>2</sub>H<sub>5</sub>OH",
        atoms: [
          { el: "C", dx: -24, dy: 0 },
          { el: "C", dx: 4,   dy: 0 },
          { el: "H", dx: -44, dy: 0 },
          { el: "H", dx: -24, dy: -24 },
          { el: "H", dx: -24, dy: 24 },
          { el: "H", dx: 4,   dy: -24 },
          { el: "H", dx: 4,   dy: 24 },
          { el: "O", dx: 28,  dy: 0 },
          { el: "H", dx: 46,  dy: -10 }
        ]
      },
      {
        name: "酸素",
        coeff: 3,
        formula: "O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "二酸化炭素",
        coeff: 2,
        formula: "CO<sub>2</sub>",
        atoms: [
          { el: "O", dx: -34, dy: 0 },
          { el: "C", dx: 0,   dy: 0 },
          { el: "O", dx: 34,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 3,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "hs_ostwald",
    category: "高校・上級",
    title: "㉓ アンモニアの酸化",
    shortFormula: "4NH₃ + 5O₂ → 4NO + 6H₂O",
    note: "左辺の O₂ が「5/2」になるため全体を2倍します。係数が全体的に大きくなるパズルです。",
    lhs: [
      {
        name: "アンモニア",
        coeff: 4,
        formula: "NH<sub>3</sub>",
        atoms: [
          { el: "N", dx: 0,   dy: -10 },
          { el: "H", dx: -22, dy: 14 },
          { el: "H", dx: 0,   dy: 18 },
          { el: "H", dx: 22,  dy: 14 }
        ]
      },
      {
        name: "酸素",
        coeff: 5,
        formula: "O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "一酸化窒素",
        coeff: 4,
        formula: "NO",
        atoms: [
          { el: "N", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 6,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "hs_pyrite",
    category: "高校・上級",
    title: "㉔ 黄鉄鉱の燃焼",
    shortFormula: "4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂",
    note: "係数に「11」が登場する大物パズル！ Fe・S・O の3種類だけで手応え抜群です。",
    lhs: [
      {
        name: "黄鉄鉱",
        coeff: 4,
        formula: "FeS<sub>2</sub>",
        atoms: [
          { el: "S",  dx: -34, dy: 0 },
          { el: "Fe", dx: 0,   dy: 0 },
          { el: "S",  dx: 34,  dy: 0 }
        ]
      },
      {
        name: "酸素",
        coeff: 11,
        formula: "O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "酸化鉄(III)",
        coeff: 2,
        formula: "Fe<sub>2</sub>O<sub>3</sub>",
        atoms: [
          { el: "O",  dx: -36, dy: -8 },
          { el: "Fe", dx: -18, dy: 8 },
          { el: "O",  dx: 0,   dy: -8 },
          { el: "Fe", dx: 18,  dy: 8 },
          { el: "O",  dx: 36,  dy: -8 }
        ]
      },
      {
        name: "二酸化硫黄",
        coeff: 8,
        formula: "SO<sub>2</sub>",
        atoms: [
          { el: "S", dx: 0,   dy: -8 },
          { el: "O", dx: -24, dy: 12 },
          { el: "O", dx: 24,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "hs_no2_h2o",
    category: "高校・上級",
    title: "㉕ 二酸化窒素と水の反応",
    shortFormula: "3NO₂ + H₂O → 2HNO₃ + NO",
    note: "同じ窒素（N）が右辺の HNO₃ と NO の2箇所に枝分かれするパズルです。",
    lhs: [
      {
        name: "二酸化窒素",
        coeff: 3,
        formula: "NO<sub>2</sub>",
        atoms: [
          { el: "N", dx: 0,   dy: -8 },
          { el: "O", dx: -24, dy: 12 },
          { el: "O", dx: 24,  dy: 12 }
        ]
      },
      {
        name: "水",
        coeff: 1,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ],
    rhs: [
      {
        name: "硝酸",
        coeff: 2,
        formula: "HNO<sub>3</sub>",
        atoms: [
          { el: "N", dx: 0,   dy: 0 },
          { el: "O", dx: 0,   dy: -24 },
          { el: "O", dx: -22, dy: 14 },
          { el: "O", dx: 22,  dy: 14 },
          { el: "H", dx: 38,  dy: 6 }
        ]
      },
      {
        name: "一酸化窒素",
        coeff: 1,
        formula: "NO",
        atoms: [
          { el: "N", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      }
    ]
  },
  {
    id: "hs_cl2_naoh",
    category: "高校・上級",
    title: "㉖ 塩素と水酸化ナトリウムの反応",
    shortFormula: "2NaOH + Cl₂ → NaCl + NaClO + H₂O",
    note: "原子は4種類ありますが、Cl が2つの塩（NaCl と NaClO）に分かれる仕組みが視覚で分かります。",
    lhs: [
      {
        name: "水酸化ナトリウム",
        coeff: 2,
        formula: "NaOH",
        atoms: [
          { el: "Na", dx: -24, dy: 0 },
          { el: "O",  dx: 6,   dy: 0 },
          { el: "H",  dx: 28,  dy: 0 }
        ]
      },
      {
        name: "塩素",
        coeff: 1,
        formula: "Cl<sub>2</sub>",
        atoms: [
          { el: "Cl", dx: -17, dy: 0 },
          { el: "Cl", dx: 17,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "塩化ナトリウム",
        coeff: 1,
        formula: "NaCl",
        atoms: [
          { el: "Na", dx: -18, dy: 0 },
          { el: "Cl", dx: 18,  dy: 0 }
        ]
      },
      {
        name: "次亜塩素酸Na",
        coeff: 1,
        formula: "NaClO",
        atoms: [
          { el: "Na", dx: -32, dy: 0 },
          { el: "O",  dx: 0,   dy: 0 },
          { el: "Cl", dx: 32,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 1,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "hs_cu_hno3",
    category: "高校・超上級",
    title: "㉗ 銅と希硝酸の反応",
    shortFormula: "3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O",
    note: "窒素（N）が右辺の2箇所に分かれ、HNO₃ の係数が「8」まで増える難関式です。",
    lhs: [
      {
        name: "銅",
        coeff: 3,
        formula: "Cu",
        atoms: [{ el: "Cu", dx: 0, dy: 0 }]
      },
      {
        name: "硝酸",
        coeff: 8,
        formula: "HNO<sub>3</sub>",
        atoms: [
          { el: "N", dx: 0,   dy: 0 },
          { el: "O", dx: 0,   dy: -24 },
          { el: "O", dx: -22, dy: 14 },
          { el: "O", dx: 22,  dy: 14 },
          { el: "H", dx: 38,  dy: 6 }
        ]
      }
    ],
    rhs: [
      {
        name: "硝酸銅(II)",
        coeff: 3,
        formula: "Cu(NO<sub>3</sub>)<sub>2</sub>",
        atoms: [
          { el: "Cu", dx: 0,   dy: 0 },
          { el: "N",  dx: -36, dy: 0 },
          { el: "O",  dx: -36, dy: -26 },
          { el: "O",  dx: -54, dy: 14 },
          { el: "O",  dx: -24, dy: 24 },
          { el: "N",  dx: 36,  dy: 0 },
          { el: "O",  dx: 36,  dy: -26 },
          { el: "O",  dx: 54,  dy: 14 },
          { el: "O",  dx: 24,  dy: 24 }
        ]
      },
      {
        name: "一酸化窒素",
        coeff: 2,
        formula: "NO",
        atoms: [
          { el: "N", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 4,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  },
  {
    id: "hs_k2cr2o7",
    category: "高校・超上級",
    title: "㉘ 二クロム酸カリウムと過酸化水素の反応",
    shortFormula: "K₂Cr₂O₇ + 3H₂O₂ + 4H₂SO₄ → Cr₂(SO₄)₃ + K₂SO₄ + 3O₂ + 7H₂O",
    note: "未定係数法の代表格！ 7種類の物質が登場し、右辺の H₂O が「7」になるボス級問題です。",
    lhs: [
      {
        name: "二クロム酸K",
        coeff: 1,
        formula: "K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub>",
        atoms: [
          { el: "K",  dx: -48, dy: -16 },
          { el: "K",  dx: -48, dy: 16 },
          { el: "Cr", dx: -18, dy: 0 },
          { el: "Cr", dx: 18,  dy: 0 },
          { el: "O",  dx: 0,   dy: -24 },
          { el: "O",  dx: -24, dy: -26 },
          { el: "O",  dx: 24,  dy: -26 },
          { el: "O",  dx: -24, dy: 26 },
          { el: "O",  dx: 24,  dy: 26 },
          { el: "O",  dx: 46,  dy: -12 },
          { el: "O",  dx: 46,  dy: 16 }
        ]
      },
      {
        name: "過酸化水素",
        coeff: 3,
        formula: "H<sub>2</sub>O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -14, dy: -6 },
          { el: "O", dx: 14,  dy: 6 },
          { el: "H", dx: -32, dy: -16 },
          { el: "H", dx: 32,  dy: 16 }
        ]
      },
      {
        name: "硫酸",
        coeff: 4,
        formula: "H<sub>2</sub>SO<sub>4</sub>",
        atoms: [
          { el: "S", dx: 0,   dy: 0 },
          { el: "O", dx: 0,   dy: -26 },
          { el: "O", dx: 0,   dy: 26 },
          { el: "O", dx: -26, dy: 0 },
          { el: "O", dx: 26,  dy: 0 },
          { el: "H", dx: -44, dy: 0 },
          { el: "H", dx: 44,  dy: 0 }
        ]
      }
    ],
    rhs: [
      {
        name: "硫酸クロム(III)",
        coeff: 1,
        formula: "Cr<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub>",
        atoms: [
          { el: "Cr", dx: -22, dy: -26 },
          { el: "Cr", dx: 22,  dy: -26 },
          { el: "S",  dx: -38, dy: 14 },
          { el: "O",  dx: -38, dy: -8 },
          { el: "O",  dx: -38, dy: 36 },
          { el: "O",  dx: -58, dy: 14 },
          { el: "O",  dx: -18, dy: 14 },
          { el: "S",  dx: 0,   dy: 14 },
          { el: "O",  dx: 0,   dy: -8 },
          { el: "O",  dx: 0,   dy: 36 },
          { el: "O",  dx: -14, dy: 30 },
          { el: "O",  dx: 14,  dy: 30 },
          { el: "S",  dx: 38,  dy: 14 },
          { el: "O",  dx: 38,  dy: -8 },
          { el: "O",  dx: 38,  dy: 36 },
          { el: "O",  dx: 58,  dy: 14 },
          { el: "O",  dx: 18,  dy: 14 }
        ]
      },
      {
        name: "硫酸カリウム",
        coeff: 1,
        formula: "K<sub>2</sub>SO<sub>4</sub>",
        atoms: [
          { el: "K", dx: -46, dy: -12 },
          { el: "K", dx: -46, dy: 16 },
          { el: "S", dx: 6,   dy: 0 },
          { el: "O", dx: 6,   dy: -26 },
          { el: "O", dx: 6,   dy: 26 },
          { el: "O", dx: -20, dy: 0 },
          { el: "O", dx: 32,  dy: 0 }
        ]
      },
      {
        name: "酸素",
        coeff: 3,
        formula: "O<sub>2</sub>",
        atoms: [
          { el: "O", dx: -16, dy: 0 },
          { el: "O", dx: 16,  dy: 0 }
        ]
      },
      {
        name: "水",
        coeff: 7,
        formula: "H<sub>2</sub>O",
        atoms: [
          { el: "O", dx: 0,   dy: -6 },
          { el: "H", dx: -22, dy: 12 },
          { el: "H", dx: 22,  dy: 12 }
        ]
      }
    ]
  }
];

const state = {
  currentIndex: 0,
  layers: {
    names: true,
    formulas: true,
    models: true
  },
  quizMasked: false,
  isAnimating: false,
  highlightedEl: null,
  coeffs: { lhs: [], rhs: [] },
  lastPop: null
};

// DOM Elements
const reactionBadgeEl = document.getElementById("reaction-badge");
const reactionSelectEl = document.getElementById("reaction-select");
const equationGridEl = document.getElementById("equation-grid");
const coeffBarEl = document.getElementById("coeff-bar");
const atomCountsEl = document.getElementById("atom-counts");
const atomCheckStatusEl = document.getElementById("atom-check-status");
const reactionNoteEl = document.getElementById("reaction-note");
const animLayerEl = document.getElementById("anim-layer");
const animateBtn = document.getElementById("animate-btn");
const resetOneBtn = document.getElementById("reset-one-btn");
const solveCoeffBtn = document.getElementById("solve-coeff-btn");
const quizToggleBtn = document.getElementById("quiz-toggle");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeLabelEl = document.getElementById("theme-label");
const fullscreenToggleBtn = document.getElementById("fullscreen-toggle");
const fullscreenLabelEl = document.getElementById("fullscreen-label");
const panelEquationsEl = document.getElementById("panel-equations");
const panelHtubeEl = document.getElementById("panel-htube");
const htubeIframeEl = document.getElementById("htube-iframe");
const shortcutHintEl = document.querySelector(".shortcut-hint");
const appModeTabs = document.querySelectorAll(".app-mode-tab");

/* ================= Top-Level App Tab Switching ================= */
function switchAppTab(tabName) {
  const isEquations = tabName === "equations";
  appModeTabs.forEach((btn) => {
    const active = btn.dataset.appTab === tabName;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
  panelEquationsEl.classList.toggle("hidden", !isEquations);
  panelHtubeEl.classList.toggle("hidden", isEquations);
  if (shortcutHintEl) {
    shortcutHintEl.style.display = isEquations ? "" : "none";
  }
}

appModeTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    switchAppTab(btn.dataset.appTab);
  });
});

/* ================= Theme & Fullscreen ================= */
function initTheme() {
  const saved = localStorage.getItem("chem-model-theme") || "light";
  applyTheme(saved);
}

function syncIframeTheme(theme) {
  if (!htubeIframeEl) return;
  try {
    const doc = htubeIframeEl.contentDocument;
    if (doc && doc.documentElement) {
      doc.documentElement.setAttribute("data-theme", theme);
    }
  } catch (_) {
    // Ignore cross-origin restrictions (e.g. file://)
  }
}

if (htubeIframeEl) {
  htubeIframeEl.addEventListener("load", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    syncIframeTheme(current);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("chem-model-theme", theme);
  themeLabelEl.textContent = theme === "dark" ? "ライト" : "ダーク";
  syncIframeTheme(theme);
}

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

fullscreenToggleBtn.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.warn("Fullscreen failed:", err);
  }
});

document.addEventListener("fullscreenchange", () => {
  const isFs = Boolean(document.fullscreenElement);
  document.body.classList.toggle("is-fullscreen", isFs);
  fullscreenLabelEl.textContent = isFs ? "元に戻す" : "全画面";
});

/* ================= Reaction Selector Rendering ================= */
function renderReactionSelect() {
  reactionSelectEl.innerHTML = "";
  const groups = new Map();

  REACTIONS.forEach((rxn, idx) => {
    if (!groups.has(rxn.category)) {
      const group = document.createElement("optgroup");
      group.label = rxn.category;
      groups.set(rxn.category, group);
      reactionSelectEl.appendChild(group);
    }

    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = rxn.title;
    groups.get(rxn.category).appendChild(opt);
  });

  reactionSelectEl.value = String(state.currentIndex);
}

reactionSelectEl.addEventListener("change", (e) => {
  selectReaction(Number(e.target.value));
});

function initCoeffsForReaction(rxn) {
  state.coeffs = {
    lhs: rxn.lhs.map(() => 1),
    rhs: rxn.rhs.map(() => 1)
  };
  state.lastPop = null;
}

function selectReaction(index) {
  if (state.isAnimating) return;
  state.currentIndex = index;
  state.highlightedEl = null;
  initCoeffsForReaction(REACTIONS[index]);
  reactionSelectEl.value = String(index);
  renderStage();
}

function getMaxCoeff(term) {
  return Math.max(6, term.coeff + 2);
}

function updateCoeff(side, termIndex, delta) {
  if (state.isAnimating) return;
  const rxn = REACTIONS[state.currentIndex];
  const term = rxn[side][termIndex];
  const maxCoeff = getMaxCoeff(term);
  const current = state.coeffs[side][termIndex];
  const next = Math.max(1, Math.min(maxCoeff, current + delta));
  if (next === current) return;

  state.coeffs[side][termIndex] = next;
  state.lastPop = next > current ? { side, termIndex, fromIndex: current } : null;
  renderStage();
}

function isAllOnes() {
  return (
    state.coeffs.lhs.every((c) => c === 1) &&
    state.coeffs.rhs.every((c) => c === 1)
  );
}

function isCoeffsBalancedDefault(rxn) {
  return (
    rxn.lhs.every((t, i) => state.coeffs.lhs[i] === t.coeff) &&
    rxn.rhs.every((t, i) => state.coeffs.rhs[i] === t.coeff)
  );
}

resetOneBtn.addEventListener("click", () => {
  if (state.isAnimating) return;
  initCoeffsForReaction(REACTIONS[state.currentIndex]);
  renderStage();
});

solveCoeffBtn.addEventListener("click", () => {
  if (state.isAnimating) return;
  const rxn = REACTIONS[state.currentIndex];
  state.coeffs = {
    lhs: rxn.lhs.map((t) => t.coeff),
    rhs: rxn.rhs.map((t) => t.coeff)
  };
  state.lastPop = null;
  renderStage();
});

/* ================= SVG Atom & Molecule Rendering ================= */
function createSvgDefs() {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  Object.values(ATOMS).forEach((atom) => {
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
    grad.setAttribute("id", `grad-${atom.symbol}`);
    grad.setAttribute("cx", "35%");
    grad.setAttribute("cy", "32%");
    grad.setAttribute("r", "68%");

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", atom.light);

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", atom.dark);

    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
  });
  return defs;
}

function buildAtomGroup(el, cx, cy, side, scale = 1) {
  const info = ATOMS[el];
  const r = info.r * scale;

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "atom-node");
  g.dataset.el = el;
  g.dataset.side = side;

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", `url(#grad-${el})`);
  circle.setAttribute("stroke", info.stroke || "rgba(15, 23, 42, 0.35)");
  circle.setAttribute("stroke-width", info.stroke ? "2" : "1.5");

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", cx);
  text.setAttribute("y", cy);
  text.setAttribute("fill", info.text);
  text.setAttribute("font-size", Math.round(r * 0.86));
  text.setAttribute("class", "atom-label");
  text.textContent = info.symbol;

  g.appendChild(circle);
  g.appendChild(text);

  g.addEventListener("mouseenter", () => setHighlight(el));
  g.addEventListener("mouseleave", () => setHighlight(null));

  return g;
}

function buildTermModelSvg(term, side, termIndex, count) {
  // Compute bounding box of a single cluster
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  term.atoms.forEach(({ el, dx, dy }) => {
    const r = ATOMS[el].r;
    minX = Math.min(minX, dx - r);
    maxX = Math.max(maxX, dx + r);
    minY = Math.min(minY, dy - r);
    maxY = Math.max(maxY, dy + r);
  });

  const clusterW = maxX - minX;
  const clusterH = maxY - minY;
  const cols = count >= 7 ? 3 : count >= 3 ? 2 : 1;
  const rows = Math.ceil(count / cols);
  const gapX = 14;
  const gapY = 12;
  const pad = 8;

  const totalW = cols * clusterW + (cols - 1) * gapX + pad * 2;
  const totalH = rows * clusterH + (rows - 1) * gapY + pad * 2;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "molecule-svg");
  svg.setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);
  svg.setAttribute("width", totalW);
  svg.setAttribute("height", totalH);
  svg.appendChild(createSvgDefs());

  const shouldPop =
    state.lastPop &&
    state.lastPop.side === side &&
    state.lastPop.termIndex === termIndex;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const offsetX = pad + col * (clusterW + gapX) - minX;
    const offsetY = pad + row * (clusterH + gapY) - minY;

    const clusterG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const cxCenter = pad + col * (clusterW + gapX) + clusterW / 2;
    const cyCenter = pad + row * (clusterH + gapY) + clusterH / 2;
    clusterG.style.transformOrigin = `${cxCenter}px ${cyCenter}px`;
    clusterG.setAttribute(
      "class",
      "molecule-cluster" + (shouldPop && i >= state.lastPop.fromIndex ? " is-new" : "")
    );

    if (term.atoms.length >= 4) {
      const boxPad = 6;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", offsetX + minX - boxPad);
      rect.setAttribute("y", offsetY + minY - boxPad);
      rect.setAttribute("width", clusterW + boxPad * 2);
      rect.setAttribute("height", clusterH + boxPad * 2);
      rect.setAttribute("rx", "12");
      rect.setAttribute("class", "poly-group-box");
      clusterG.appendChild(rect);
    }

    term.atoms.forEach(({ el, dx, dy }) => {
      const atomG = buildAtomGroup(el, offsetX + dx, offsetY + dy, side);
      clusterG.appendChild(atomG);
    });

    svg.appendChild(clusterG);
  }

  return svg;
}

/* ================= Equation Grid Rendering ================= */
function createTermColumn(term, side, termIndex) {
  const coeff = state.coeffs[side][termIndex];
  const col = document.createElement("div");
  col.className = "term-col";

  // Row 1: Substance Name Box
  const nameSlot = document.createElement("div");
  nameSlot.className = "row-slot slot-name" + (state.layers.names ? "" : " layer-hidden");
  const wordBox = document.createElement("div");
  wordBox.className = "word-box";
  wordBox.textContent = term.name;
  nameSlot.appendChild(wordBox);

  // Row 2: Formula (clean textbook display)
  const formulaSlot = document.createElement("div");
  formulaSlot.className = "row-slot slot-formula" + (state.layers.formulas ? "" : " layer-hidden");
  const formulaDiv = document.createElement("div");
  formulaDiv.className = "formula-text";
  const formattedFormula = term.formula
    .replace(/<sub>/g, '<span class="formula-sub">')
    .replace(/<\/sub>/g, "</span>");
  formulaDiv.innerHTML =
    (coeff > 1 ? `<span class="formula-coeff">${coeff}</span>` : "") + formattedFormula;
  formulaSlot.appendChild(formulaDiv);

  // Row 3: Model Diagram
  const modelSlot = document.createElement("div");
  modelSlot.className = "row-slot slot-model" + (state.layers.models ? "" : " layer-hidden");
  modelSlot.appendChild(buildTermModelSvg(term, side, termIndex, coeff));

  col.appendChild(nameSlot);
  col.appendChild(formulaSlot);
  col.appendChild(modelSlot);
  return col;
}

function createOperatorColumn(symbol, isArrow = false) {
  const col = document.createElement("div");
  col.className = "op-col";

  const rows = [
    { cls: "slot-name", visible: state.layers.names },
    { cls: "slot-formula", visible: state.layers.formulas },
    { cls: "slot-model", visible: state.layers.models }
  ];

  rows.forEach(({ cls, visible }) => {
    const slot = document.createElement("div");
    slot.className = `row-slot ${cls}` + (visible ? "" : " layer-hidden");
    const span = document.createElement("span");
    span.className = "op-symbol" + (isArrow ? " op-arrow" : "");
    span.textContent = symbol;
    slot.appendChild(span);
    col.appendChild(slot);
  });

  return col;
}

function renderStage() {
  const rxn = REACTIONS[state.currentIndex];
  reactionBadgeEl.textContent = rxn.category;
  reactionNoteEl.textContent = rxn.note;

  equationGridEl.innerHTML = "";
  equationGridEl.classList.toggle("is-dense", rxn.lhs.length + rxn.rhs.length >= 6);

  // Left-hand side (Reactants)
  rxn.lhs.forEach((term, idx) => {
    if (idx > 0) {
      equationGridEl.appendChild(createOperatorColumn("+"));
    }
    equationGridEl.appendChild(createTermColumn(term, "lhs", idx));
  });

  // Reaction Arrow
  equationGridEl.appendChild(createOperatorColumn("→", true));

  // Right-hand side (Products) wrapped for Quiz Mode
  const rhsWrapper = document.createElement("div");
  rhsWrapper.className = "rhs-quiz-wrapper" + (state.quizMasked ? " masked" : "");

  rxn.rhs.forEach((term, idx) => {
    if (idx > 0) {
      rhsWrapper.appendChild(createOperatorColumn("+"));
    }
    rhsWrapper.appendChild(createTermColumn(term, "rhs", idx));
  });

  const quizOverlay = document.createElement("div");
  quizOverlay.className = "quiz-overlay";
  quizOverlay.innerHTML = `
    <div class="quiz-overlay-q">？</div>
    <div class="quiz-overlay-text">クリックして反応後を表示</div>
  `;
  quizOverlay.addEventListener("click", () => {
    state.quizMasked = false;
    quizToggleBtn.classList.remove("active");
    renderStage();
  });
  rhsWrapper.appendChild(quizOverlay);

  equationGridEl.appendChild(rhsWrapper);

  resetOneBtn.hidden = isAllOnes();
  solveCoeffBtn.hidden = isCoeffsBalancedDefault(rxn);
  renderCoeffBar(rxn);
  renderAtomCounts(rxn);
  state.lastPop = null;
}

/* ================= Coefficient Control Bar ================= */
function buildCoeffControlItem(term, side, termIndex, masked) {
  const coeff = state.coeffs[side][termIndex];
  const item = document.createElement("div");
  item.className = "coeff-control-item" + (masked ? " is-masked" : "");

  const label = document.createElement("span");
  label.className = "coeff-control-label";
  label.innerHTML = masked
    ? "？"
    : `${term.name} (${term.formula.replace(/<sub>/g, '<span class="formula-sub">').replace(/<\/sub>/g, "</span>")})`;

  const stepper = document.createElement("div");
  stepper.className = "coeff-stepper";
  stepper.setAttribute("aria-label", `${term.name}の係数を変更`);

  const minusBtn = document.createElement("button");
  minusBtn.type = "button";
  minusBtn.className = "coeff-btn";
  minusBtn.textContent = "−";
  minusBtn.disabled = masked || coeff <= 1;
  minusBtn.title = "係数を1減らす";
  minusBtn.addEventListener("click", () => updateCoeff(side, termIndex, -1));

  const valSpan = document.createElement("span");
  valSpan.className = "coeff-val";
  valSpan.textContent = masked ? "?" : String(coeff);

  const plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.className = "coeff-btn";
  plusBtn.textContent = "＋";
  plusBtn.disabled = masked || coeff >= getMaxCoeff(term);
  plusBtn.title = "係数を1増やす";
  plusBtn.addEventListener("click", () => updateCoeff(side, termIndex, 1));

  stepper.appendChild(minusBtn);
  stepper.appendChild(valSpan);
  stepper.appendChild(plusBtn);

  item.appendChild(label);
  item.appendChild(stepper);
  return item;
}

function renderCoeffBar(rxn) {
  coeffBarEl.innerHTML = "";

  const title = document.createElement("span");
  title.className = "coeff-bar-title";
  title.textContent = "係数（セット数）を調整：";
  coeffBarEl.appendChild(title);

  rxn.lhs.forEach((term, idx) => {
    coeffBarEl.appendChild(buildCoeffControlItem(term, "lhs", idx, false));
  });

  const arrow = document.createElement("span");
  arrow.className = "coeff-bar-arrow";
  arrow.textContent = "→";
  coeffBarEl.appendChild(arrow);

  rxn.rhs.forEach((term, idx) => {
    coeffBarEl.appendChild(buildCoeffControlItem(term, "rhs", idx, state.quizMasked));
  });
}

/* ================= Atom Count Verification ================= */
function countAtoms(terms, coeffList) {
  const counts = {};
  terms.forEach((term, idx) => {
    const count = coeffList[idx];
    term.atoms.forEach(({ el }) => {
      counts[el] = (counts[el] || 0) + count;
    });
  });
  return counts;
}

function renderAtomCounts(rxn) {
  const lhsCounts = countAtoms(rxn.lhs, state.coeffs.lhs);
  const rhsCounts = countAtoms(rxn.rhs, state.coeffs.rhs);
  const allElements = Array.from(new Set([...Object.keys(lhsCounts), ...Object.keys(rhsCounts)]));

  atomCountsEl.innerHTML = "";
  let allBalanced = true;

  allElements.forEach((el) => {
    const lVal = lhsCounts[el] || 0;
    const rVal = rhsCounts[el] || 0;
    const balanced = lVal === rVal;
    if (!balanced) allBalanced = false;

    const info = ATOMS[el];
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "atom-count-pill" + (balanced ? "" : " unbalanced");
    pill.innerHTML = `
      <span class="atom-dot" style="background: radial-gradient(circle at 35% 32%, ${info.light}, ${info.dark});"></span>
      <span>${info.symbol}: ${lVal}個 ${balanced ? "＝" : "≠"} ${rVal}個</span>
    `;
    pill.addEventListener("mouseenter", () => setHighlight(el));
    pill.addEventListener("mouseleave", () => setHighlight(null));
    atomCountsEl.appendChild(pill);
  });

  if (allBalanced) {
    atomCheckStatusEl.textContent = "✓ 反応前後で同じ";
    atomCheckStatusEl.classList.remove("unbalanced");
    animateBtn.disabled = false;
    animateBtn.title = "原子の組み替えを再生";
  } else {
    atomCheckStatusEl.textContent = "⚠ 数が合っていない";
    atomCheckStatusEl.classList.add("unbalanced");
    animateBtn.disabled = true;
    animateBtn.title = "左右の原子の数をそろえると再生できます";
  }
}

function setHighlight(el) {
  state.highlightedEl = el;
  const nodes = equationGridEl.querySelectorAll(".atom-node");
  nodes.forEach((node) => {
    if (!el) {
      node.classList.remove("dimmed", "highlighted");
    } else if (node.dataset.el === el) {
      node.classList.add("highlighted");
      node.classList.remove("dimmed");
    } else {
      node.classList.add("dimmed");
      node.classList.remove("highlighted");
    }
  });
}

/* ================= Layer & Quiz Toggles ================= */
document.querySelectorAll(".pill-btn[data-layer]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const layer = btn.dataset.layer;
    state.layers[layer] = !state.layers[layer];
    btn.classList.toggle("active", state.layers[layer]);
    renderStage();
  });
});

quizToggleBtn.addEventListener("click", () => {
  state.quizMasked = !state.quizMasked;
  quizToggleBtn.classList.toggle("active", state.quizMasked);
  renderStage();
});

/* ================= Rearrangement Animation ================= */
function playRearrangementAnimation() {
  if (state.isAnimating) return;

  // Ensure models and RHS are visible for the animation
  if (!state.layers.models) {
    state.layers.models = true;
    document.querySelector('.pill-btn[data-layer="models"]').classList.add("active");
  }
  if (state.quizMasked) {
    state.quizMasked = false;
    quizToggleBtn.classList.remove("active");
  }
  renderStage();

  const boardRect = equationGridEl.closest(".board").getBoundingClientRect();
  const lhsNodes = Array.from(equationGridEl.querySelectorAll('.atom-node[data-side="lhs"]'));
  const rhsNodes = Array.from(equationGridEl.querySelectorAll('.atom-node[data-side="rhs"]'));

  if (!lhsNodes.length || lhsNodes.length !== rhsNodes.length) return;

  // Match each LHS atom 1-to-1 with an RHS atom of the same element
  const rhsPool = [...rhsNodes];
  const pairs = [];

  lhsNodes.forEach((lhsNode) => {
    const el = lhsNode.dataset.el;
    const matchIdx = rhsPool.findIndex((n) => n.dataset.el === el);
    if (matchIdx === -1) return;
    const rhsNode = rhsPool.splice(matchIdx, 1)[0];

    const lRect = lhsNode.querySelector("circle").getBoundingClientRect();
    const rRect = rhsNode.querySelector("circle").getBoundingClientRect();

    pairs.push({
      el,
      startX: lRect.left + lRect.width / 2 - boardRect.left,
      startY: lRect.top + lRect.height / 2 - boardRect.top,
      endX: rRect.left + rRect.width / 2 - boardRect.left,
      endY: rRect.top + rRect.height / 2 - boardRect.top,
      r: lRect.width / 2,
      arcY: (Math.random() - 0.5) * 70
    });
  });

  state.isAnimating = true;
  animateBtn.disabled = true;
  equationGridEl.classList.add("is-animating");

  animLayerEl.innerHTML = "";
  animLayerEl.appendChild(createSvgDefs());

  const flyingAtoms = pairs.map((p) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const info = ATOMS[p.el];

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", p.r);
    circle.setAttribute("fill", `url(#grad-${p.el})`);
    circle.setAttribute("stroke", "rgba(15, 23, 42, 0.4)");
    circle.setAttribute("stroke-width", "1.5");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("fill", info.text);
    text.setAttribute("font-size", Math.round(p.r * 0.86));
    text.setAttribute("class", "atom-label");
    text.textContent = info.symbol;

    g.appendChild(circle);
    g.appendChild(text);
    animLayerEl.appendChild(g);
    return { g, ...p };
  });

  const duration = 1400;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const rawT = Math.min((now - startTime) / duration, 1);
    const t = easeInOutCubic(rawT);

    flyingAtoms.forEach((a) => {
      const x = a.startX + (a.endX - a.startX) * t;
      // Smooth arc during bond rearrangement
      const y = a.startY + (a.endY - a.startY) * t + Math.sin(t * Math.PI) * a.arcY;
      a.g.setAttribute("transform", `translate(${x}, ${y})`);
    });

    if (rawT < 1) {
      requestAnimationFrame(step);
    } else {
      animLayerEl.innerHTML = "";
      equationGridEl.classList.remove("is-animating");
      state.isAnimating = false;
      animateBtn.disabled = false;
    }
  }

  requestAnimationFrame(step);
}

animateBtn.addEventListener("click", playRearrangementAnimation);

/* ================= Keyboard Navigation ================= */
document.addEventListener("keydown", (e) => {
  if (panelEquationsEl.classList.contains("hidden")) return;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    e.preventDefault();
    selectReaction((state.currentIndex + 1) % REACTIONS.length);
  } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault();
    selectReaction((state.currentIndex - 1 + REACTIONS.length) % REACTIONS.length);
  } else if (e.code === "Space" && document.activeElement.tagName !== "BUTTON") {
    e.preventDefault();
    playRearrangementAnimation();
  }
});

/* ================= Initialize ================= */
initTheme();
initCoeffsForReaction(REACTIONS[state.currentIndex]);
renderReactionSelect();
renderStage();
