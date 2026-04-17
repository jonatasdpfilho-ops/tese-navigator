import jsPDF from "jspdf";
import type { Tese, Maturidade } from "@/data/teses";
import type { Oportunidade, RespostasEmpresa, Urgencia } from "@/data/oportunidades";

const URGENCIA_RGB: Record<Urgencia, [number, number, number]> = {
  Alta: [155, 28, 28],
  Média: [201, 168, 76],
  Baixa: [20, 92, 56],
};

const MATURITY_RGB: Record<Maturidade, [number, number, number]> = {
  "Pacificada": [20, 92, 56],
  "Em afetação": [201, 168, 76],
  "Controvertida": [155, 28, 28],
  "Desfavorável": [107, 107, 107],
  "Regulatória": [10, 95, 85],
};

const NAVY: [number, number, number] = [0, 51, 102];
const NAVY_DEEP: [number, number, number] = [0, 31, 68];
const GOLD: [number, number, number] = [201, 168, 76];
const GOLD_LIGHT: [number, number, number] = [240, 217, 139];
const TEXT: [number, number, number] = [30, 30, 40];
const MUTED: [number, number, number] = [110, 110, 120];

interface Empresa {
  razao_social?: string;
  cnpj?: string;
  cnae_fiscal?: string | number;
  cnae_fiscal_descricao?: string;
  porte?: string;
  situacao_cadastral?: string;
}

interface ResumoFin {
  total: number;
  pacificadas: number;
  emAfetacao: number;
  reforma: number;
  creditoCons: number;
  creditoOt: number;
}

export function exportPdf(opts: {
  empresa: Empresa;
  regime: string;
  faturamento: number;
  teses: Tese[];
  resumo: ResumoFin;
  analiseIa: string;
}) {
  const { empresa, regime, faturamento, teses, resumo, analiseIa } = opts;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const M = 14;
  let y = 0;

  const setFill = (rgb: [number, number, number]) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  const setText = (rgb: [number, number, number]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);

  const ensureSpace = (need: number) => {
    if (y + need > H - 16) {
      addFooter();
      doc.addPage();
      y = M;
    }
  };

  let page = 1;
  const addFooter = () => {
    setText(MUTED);
    doc.setFontSize(8);
    doc.text(
      `Radar de Teses Tributárias 2026  ·  ${new Date().toLocaleDateString("pt-BR")}`,
      M,
      H - 8,
    );
    doc.text(`Página ${page}`, W - M, H - 8, { align: "right" });
    page++;
  };

  // === Cabeçalho navy ===
  setFill(NAVY_DEEP);
  doc.rect(0, 0, W, 38, "F");
  setFill(GOLD);
  doc.rect(M, 10, 8, 8, "F");
  setText([255, 255, 255]);
  doc.setFontSize(8);
  doc.text("RT", M + 4, 16, { align: "center" });

  doc.setFontSize(14);
  setText(GOLD);
  doc.text("Radar de Teses Tributárias 2026", M + 14, 14);

  setText([235, 235, 245]);
  doc.setFontSize(9);
  doc.text(`${empresa.razao_social || "—"}`, M + 14, 21);
  doc.setFontSize(8);
  doc.text(
    `CNPJ ${empresa.cnpj || "—"}  ·  CNAE ${empresa.cnae_fiscal || "—"}  ·  ${regime}  ·  Fat. R$ ${(faturamento || 0).toLocaleString("pt-BR")}`,
    M + 14,
    27,
  );
  doc.text(
    `Gerado em ${new Date().toLocaleString("pt-BR")}`,
    M + 14,
    32,
  );

  y = 46;

  // === Painel resumo ===
  const cards = [
    { l: "Total", v: String(resumo.total) },
    { l: "Pacificadas", v: String(resumo.pacificadas) },
    { l: "Em afetação", v: String(resumo.emAfetacao) },
    { l: "Reforma Trib.", v: String(resumo.reforma) },
  ];
  const cw = (W - M * 2 - 6) / 4;
  cards.forEach((c, i) => {
    const x = M + i * (cw + 2);
    setFill(NAVY);
    doc.roundedRect(x, y, cw, 18, 1.5, 1.5, "F");
    setText(GOLD_LIGHT);
    doc.setFontSize(14);
    doc.text(c.v, x + cw / 2, y + 9, { align: "center" });
    setText([220, 225, 240]);
    doc.setFontSize(7);
    doc.text(c.l, x + cw / 2, y + 14, { align: "center" });
  });
  y += 22;

  if (faturamento > 0 && resumo.creditoCons > 0) {
    setFill([245, 240, 220]);
    doc.roundedRect(M, y, W - M * 2, 16, 1.5, 1.5, "F");
    setText(NAVY);
    doc.setFontSize(8);
    doc.text("Crédito potencial (5 anos · art. 168, I CTN)", M + 4, y + 6);
    doc.setFontSize(11);
    setText(NAVY_DEEP);
    doc.text(
      `Conservador: R$ ${Math.round(resumo.creditoCons).toLocaleString("pt-BR")}   ·   Otimista: R$ ${Math.round(resumo.creditoOt).toLocaleString("pt-BR")}`,
      M + 4,
      y + 12,
    );
    y += 20;
  }

  // === Análise IA ===
  if (analiseIa && analiseIa.trim()) {
    ensureSpace(10);
    setText(NAVY);
    doc.setFontSize(11);
    doc.text("Análise Executiva (IA)", M, y);
    y += 5;
    setText(TEXT);
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(analiseIa.trim(), W - M * 2);
    lines.forEach((ln: string) => {
      ensureSpace(5);
      doc.text(ln, M, y);
      y += 4.2;
    });
    y += 3;
  }

  // === Teses ===
  ensureSpace(10);
  setText(NAVY);
  doc.setFontSize(11);
  doc.text(`Teses Qualificadas (${teses.length})`, M, y);
  y += 5;

  teses.forEach((t) => {
    const blockH = 46;
    ensureSpace(blockH);
    const top = y;

    // borda lateral colorida
    const rgb = MATURITY_RGB[t.maturidade];
    setFill(rgb);
    doc.rect(M, top, 1.2, blockH - 2, "F");

    // card bg
    setFill([252, 252, 254]);
    doc.rect(M + 1.2, top, W - M * 2 - 1.2, blockH - 2, "F");
    doc.setDrawColor(220, 225, 235);
    doc.rect(M + 1.2, top, W - M * 2 - 1.2, blockH - 2, "S");

    // header: id + area + badge maturidade
    setText(MUTED);
    doc.setFontSize(7);
    doc.text(`${t.id}  ·  ${t.area}`, M + 4, top + 5);

    // badge maturidade direita
    const badgeText = t.maturidade;
    const badgeW = doc.getTextWidth(badgeText) + 4;
    setFill(rgb);
    doc.roundedRect(W - M - badgeW - 1, top + 2, badgeW, 4.5, 0.8, 0.8, "F");
    setText([255, 255, 255]);
    doc.setFontSize(6.5);
    doc.text(badgeText, W - M - badgeW / 2 - 1, top + 5.2, { align: "center" });

    // nome
    setText(NAVY_DEEP);
    doc.setFontSize(10);
    const nomeLines = doc.splitTextToSize(t.nome, W - M * 2 - 6);
    doc.text(nomeLines, M + 4, top + 10);

    let yi = top + 10 + nomeLines.length * 4;

    setText(MUTED);
    doc.setFontSize(7);
    doc.text(`Regimes: ${t.regimes.join(", ")}  ·  Risco: ${t.risco}`, M + 4, yi);
    yi += 3.5;

    setText(TEXT);
    doc.setFontSize(7.5);
    const cnaeLines = doc.splitTextToSize(`Perfil: ${t.cnae_desc}`, W - M * 2 - 6);
    doc.text(cnaeLines, M + 4, yi);
    yi += cnaeLines.length * 3 + 1;

    const leiLines = doc.splitTextToSize(`Base legal: ${t.lei}`, W - M * 2 - 6);
    doc.text(leiLines, M + 4, yi);
    yi += leiLines.length * 3 + 1;

    setText(NAVY);
    doc.text(`Estimativa conservadora: ${t.est_cons}`, M + 4, yi);
    yi += 3.5;

    // alerta box
    setFill([255, 248, 225]);
    const alertaLines = doc.splitTextToSize(`⚠ ${t.alerta}`, W - M * 2 - 8);
    const alertaH = alertaLines.length * 3 + 3;
    doc.rect(M + 4, yi, W - M * 2 - 8, alertaH, "F");
    setText([120, 80, 0]);
    doc.setFontSize(6.8);
    doc.text(alertaLines, M + 5, yi + 3);

    y = top + blockH;
  });

  addFooter();
  const safe = (empresa.razao_social || "empresa").replace(/[^\w]+/g, "_").slice(0, 40);
  doc.save(`radar-teses-${safe}.pdf`);
}

export function exportJson(opts: {
  empresa: Empresa;
  regime: string;
  faturamento: number;
  teses: Tese[];
}) {
  const payload = {
    empresa: opts.empresa,
    regime: opts.regime,
    faturamento: opts.faturamento,
    geradoEm: new Date().toISOString(),
    total: opts.teses.length,
    teses: opts.teses.map(({ cnae_fn, ...rest }) => rest),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safe = (opts.empresa.razao_social || "empresa").replace(/[^\w]+/g, "_").slice(0, 40);
  a.download = `radar-teses-${safe}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// =================================================================
// MÓDULO EMPRESARIAL
// =================================================================

interface ResumoEmp {
  total: number;
  alta: number;
  media: number;
  baixa: number;
  modulos_ativos: number;
}

export function exportPdfEmpresarial(opts: {
  respostas: RespostasEmpresa;
  oportunidades: Oportunidade[];
  resumo: ResumoEmp;
  analiseIa: string;
}) {
  const { respostas, oportunidades, resumo, analiseIa } = opts;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const M = 14;
  let y = 0;

  const setFill = (rgb: [number, number, number]) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  const setText = (rgb: [number, number, number]) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);

  let page = 1;
  const addFooter = () => {
    setText(MUTED);
    doc.setFontSize(8);
    doc.text(
      `Diagnóstico Empresarial 2026  ·  ${new Date().toLocaleDateString("pt-BR")}`,
      M, H - 8,
    );
    doc.text(`Página ${page}`, W - M, H - 8, { align: "right" });
    page++;
  };

  const ensureSpace = (need: number) => {
    if (y + need > H - 16) {
      addFooter();
      doc.addPage();
      y = M;
    }
  };

  setFill(NAVY_DEEP);
  doc.rect(0, 0, W, 38, "F");
  setFill(GOLD);
  doc.rect(M, 10, 8, 8, "F");
  setText([255, 255, 255]);
  doc.setFontSize(8);
  doc.text("DE", M + 4, 16, { align: "center" });

  doc.setFontSize(14);
  setText(GOLD);
  doc.text("Diagnóstico Empresarial 2026", M + 14, 14);

  setText([235, 235, 245]);
  doc.setFontSize(9);
  doc.text(respostas.razao_social || "—", M + 14, 21);
  doc.setFontSize(8);
  doc.text(
    `${respostas.setor}  ·  ${respostas.regime}  ·  Fat. R$ ${respostas.faturamento.toLocaleString("pt-BR")}`,
    M + 14, 27,
  );
  doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, M + 14, 32);

  y = 46;

  const cards = [
    { l: "Total", v: String(resumo.total), c: NAVY },
    { l: "Urgência Alta", v: String(resumo.alta), c: [155, 28, 28] as [number, number, number] },
    { l: "Urgência Média", v: String(resumo.media), c: [180, 140, 40] as [number, number, number] },
    { l: "Módulos ativos", v: `${resumo.modulos_ativos}/4`, c: NAVY },
  ];
  const cw = (W - M * 2 - 6) / 4;
  cards.forEach((c, i) => {
    const x = M + i * (cw + 2);
    setFill(c.c);
    doc.roundedRect(x, y, cw, 18, 1.5, 1.5, "F");
    setText(GOLD_LIGHT);
    doc.setFontSize(14);
    doc.text(c.v, x + cw / 2, y + 9, { align: "center" });
    setText([220, 225, 240]);
    doc.setFontSize(7);
    doc.text(c.l, x + cw / 2, y + 14, { align: "center" });
  });
  y += 22;

  if (analiseIa && analiseIa.trim()) {
    ensureSpace(10);
    setText(NAVY);
    doc.setFontSize(11);
    doc.text("Análise Executiva (IA)", M, y);
    y += 5;
    setText(TEXT);
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(analiseIa.trim(), W - M * 2);
    lines.forEach((ln: string) => {
      ensureSpace(5);
      doc.text(ln, M, y);
      y += 4.2;
    });
    y += 3;
  }

  ensureSpace(10);
  setText(NAVY);
  doc.setFontSize(11);
  doc.text(`Oportunidades Identificadas (${oportunidades.length})`, M, y);
  y += 5;

  oportunidades.forEach((o) => {
    const passos = o.proximos_passos.length;
    const blockH = 56 + passos * 3.2;
    ensureSpace(blockH);
    const top = y;

    const rgb = URGENCIA_RGB[o.urgencia];
    setFill(rgb);
    doc.rect(M, top, 1.2, blockH - 2, "F");

    setFill([252, 252, 254]);
    doc.rect(M + 1.2, top, W - M * 2 - 1.2, blockH - 2, "F");
    doc.setDrawColor(220, 225, 235);
    doc.rect(M + 1.2, top, W - M * 2 - 1.2, blockH - 2, "S");

    setText(MUTED);
    doc.setFontSize(7);
    doc.text(`${o.id}  ·  ${o.modulo}  ·  ${o.impacto}`, M + 4, top + 5);

    const badgeText = `Urgência ${o.urgencia}`;
    const badgeW = doc.getTextWidth(badgeText) + 4;
    setFill(rgb);
    doc.roundedRect(W - M - badgeW - 1, top + 2, badgeW, 4.5, 0.8, 0.8, "F");
    setText([255, 255, 255]);
    doc.setFontSize(6.5);
    doc.text(badgeText, W - M - badgeW / 2 - 1, top + 5.2, { align: "center" });

    setText(NAVY_DEEP);
    doc.setFontSize(10);
    const nomeLines = doc.splitTextToSize(o.nome, W - M * 2 - 6);
    doc.text(nomeLines, M + 4, top + 10);

    let yi = top + 10 + nomeLines.length * 4;

    setText(TEXT);
    doc.setFontSize(7.5);
    const descLines = doc.splitTextToSize(o.descricao, W - M * 2 - 6);
    doc.text(descLines.slice(0, 3), M + 4, yi);
    yi += Math.min(descLines.length, 3) * 3 + 2;

    setText(MUTED);
    doc.setFontSize(6.8);
    const fundLines = doc.splitTextToSize(`Fundamento: ${o.fundamento}`, W - M * 2 - 6);
    doc.text(fundLines.slice(0, 2), M + 4, yi);
    yi += Math.min(fundLines.length, 2) * 2.8 + 2;

    setText(NAVY);
    doc.setFontSize(7);
    doc.text("Próximos passos:", M + 4, yi);
    yi += 3;
    setText(TEXT);
    o.proximos_passos.forEach((p, i) => {
      const pl = doc.splitTextToSize(`${i + 1}. ${p}`, W - M * 2 - 8);
      doc.text(pl[0], M + 5, yi);
      yi += 3;
    });

    yi += 1;
    setFill([255, 248, 225]);
    const alertaLines = doc.splitTextToSize(`⚠ ${o.alerta}`, W - M * 2 - 8);
    const alertaH = Math.min(alertaLines.length, 3) * 3 + 3;
    doc.rect(M + 4, yi, W - M * 2 - 8, alertaH, "F");
    setText([120, 80, 0]);
    doc.setFontSize(6.5);
    doc.text(alertaLines.slice(0, 3), M + 5, yi + 3);

    y = top + blockH;
  });

  addFooter();
  const safe = (respostas.razao_social || "empresa").replace(/[^\w]+/g, "_").slice(0, 40);
  doc.save(`diagnostico-empresarial-${safe}.pdf`);
}

export function exportJsonEmpresarial(opts: {
  respostas: RespostasEmpresa;
  oportunidades: Oportunidade[];
}) {
  const payload = {
    respostas: opts.respostas,
    geradoEm: new Date().toISOString(),
    total: opts.oportunidades.length,
    oportunidades: opts.oportunidades.map(({ qualify, ...rest }) => rest),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safe = (opts.respostas.razao_social || "empresa").replace(/[^\w]+/g, "_").slice(0, 40);
  a.download = `diagnostico-empresarial-${safe}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
