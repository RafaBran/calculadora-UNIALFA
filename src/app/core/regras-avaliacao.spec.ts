import {
  avaliar,
  calcularNotaComposta,
  ENTRADA_VAZIA,
  EntradaNotas,
  formatarNota,
  formatarNotaExigida,
} from './regras-avaliacao';

/** Monta a entrada usando a mesma nota para formal e processual (N = valor). */
function entrada(parcial: Partial<EntradaNotas> & { n1?: number; n2?: number }): EntradaNotas {
  const { n1, n2, ...resto } = parcial;
  return {
    ...ENTRADA_VAZIA,
    ...(n1 !== undefined ? { n1Formal: n1, n1Processual: n1 } : {}),
    ...(n2 !== undefined ? { n2Formal: n2, n2Processual: n2 } : {}),
    ...resto,
  };
}

describe('regras de avaliação (Resolução 063/2023)', () => {
  describe('nota composta (Art. 5º, parágrafo único)', () => {
    it('aplica NF × 0,8 + NPRO × 0,2', () => {
      expect(calcularNotaComposta(7, 10)).toBeCloseTo(7.6, 10);
      expect(calcularNotaComposta(10, 0)).toBeCloseTo(8, 10);
    });

    it('retorna null se faltar a formal ou a processual', () => {
      expect(calcularNotaComposta(null, 10)).toBeNull();
      expect(calcularNotaComposta(10, null)).toBeNull();
    });

    it('rejeita notas fora de 0 a 10', () => {
      expect(calcularNotaComposta(11, 5)).toBeNull();
      expect(calcularNotaComposta(5, -1)).toBeNull();
    });
  });

  it('sem notas, pede a N1', () => {
    const r = avaliar(ENTRADA_VAZIA);
    expect(r.situacao).toBe('em-andamento');
    expect(r.etapaAtual).toBe('N1');
    expect(r.etapasHabilitadas.N3).toBeFalse();
  });

  describe('após a N1', () => {
    it('informa a N2 necessária para aprovação direta e para ir à N3', () => {
      const r = avaliar(entrada({ n1: 7 }));
      expect(r.etapaAtual).toBe('N2');
      expect(r.metas[0].nota).toBeCloseTo(9, 10); // 16 - 7
      expect(r.metas.length).toBe(1); // 6 - 7 < 0: já garantiu a N3
    });

    it('indica quando a aprovação direta é impossível', () => {
      const r = avaliar(entrada({ n1: 5 }));
      expect(r.metas[0].nota).toBeNull(); // precisaria de 11
      expect(r.metas[1].nota).toBeCloseTo(1, 10); // 6 - 5
    });

    it('calcula a formal necessária quando a processual da N2 já foi informada', () => {
      const r = avaliar(entrada({ n1: 7, n2Processual: 10 }));
      // N2 ≥ 9 → NF ≥ (9 - 2) / 0,8 = 8,75
      expect(r.metas[0].notaFormal!).toBeCloseTo(8.75, 10);
    });
  });

  describe('média N1/N2 (Art. 6º e 7º)', () => {
    it('média ≥ 8 aprova direto e dispensa a N3', () => {
      const r = avaliar(entrada({ n1: 8, n2: 8 }));
      expect(r.situacao).toBe('aprovado');
      expect(r.mediaFinal).toBeCloseTo(8, 10);
      expect(r.etapasHabilitadas.N3).toBeFalse();
    });

    it('média < 3 reprova sem direito à N3', () => {
      const r = avaliar(entrada({ n1: 2, n2: 3.9 }));
      expect(r.situacao).toBe('reprovado');
      expect(r.etapasHabilitadas.N3).toBeFalse();
    });

    it('média exatamente 3 vai para a N3', () => {
      const r = avaliar(entrada({ n1: 3, n2: 3 }));
      expect(r.situacao).toBe('em-andamento');
      expect(r.etapaAtual).toBe('N3');
    });

    it('soma entre 15 e 16 ainda obriga a N3 (Art. 7º, parágrafo único)', () => {
      const r = avaliar(entrada({ n1: 7.5, n2: 7.9 }));
      expect(r.etapaAtual).toBe('N3');
      expect(r.metas[0].nota).toBe(0); // já tem soma ≥ 15
    });

    it('com média mínima (3), a N3 necessária é 9 — sempre alcançável', () => {
      const r = avaliar(entrada({ n1: 3, n2: 3 }));
      expect(r.metas[0].nota).toBeCloseTo(9, 10); // 15 - 6
    });
  });

  describe('N3 (Art. 8º e 9º)', () => {
    it('informa a N3 necessária para aprovar e para ter direito à N4', () => {
      const r = avaliar(entrada({ n1: 4, n2: 4 }));
      expect(r.metas[0].nota).toBeCloseTo(7, 10); // 15 - 8
      expect(r.metas[1].nota).toBeCloseTo(1, 10); // 9 - 8
    });

    it('média N1/N2/N3 ≥ 5 aprova', () => {
      const r = avaliar(entrada({ n1: 4, n2: 4, n3: 7 }));
      expect(r.situacao).toBe('aprovado');
      expect(r.etapasHabilitadas.N4).toBeFalse();
    });

    it('média N1/N2/N3 < 3 reprova sem direito à N4', () => {
      const r = avaliar(entrada({ n1: 4, n2: 4, n3: 0.5 }));
      expect(r.situacao).toBe('reprovado');
      expect(r.etapasHabilitadas.N4).toBeFalse();
    });

    it('média entre 3 e 5 libera a N4 com a nota necessária', () => {
      const r = avaliar(entrada({ n1: 4, n2: 4, n3: 5 }));
      expect(r.etapaAtual).toBe('N4');
      expect(r.mediaN1N2N3).toBeCloseTo(13 / 3, 10);
      expect(r.metas[0].nota).toBeCloseTo(17 / 3, 10); // 10 - 4,333… (valor exato)
    });
  });

  describe('N4 (Art. 10)', () => {
    it('média final ≥ 5 aprova', () => {
      const r = avaliar(entrada({ n1: 4, n2: 4, n3: 5, n4: 5.67 }));
      expect(r.situacao).toBe('aprovado');
    });

    it('média final < 5 reprova', () => {
      const r = avaliar(entrada({ n1: 4, n2: 4, n3: 5, n4: 5.6 }));
      expect(r.situacao).toBe('reprovado');
    });

    it('ignora a N4 se o aluno não tiver direito a ela', () => {
      const r = avaliar(entrada({ n1: 4, n2: 4, n3: 7, n4: 0 }));
      expect(r.situacao).toBe('aprovado');
      expect(r.n4).toBeNull();
    });
  });

  it('frequência < 75% reprova independentemente das notas (Art. 20)', () => {
    const r = avaliar(entrada({ n1: 10, n2: 10, frequenciaMinima: false }));
    expect(r.situacao).toBe('reprovado');
    expect(r.mensagens[0].artigo).toBe('Art. 20');
  });

  it('não sofre com erro de ponto flutuante nos limites', () => {
    // 7,9 × 0,8 + 8,4 × 0,2 = 8,0 (em float: 7,999999…)
    const r = avaliar(
      entrada({ n1Formal: 7.9, n1Processual: 8.4, n2Formal: 7.9, n2Processual: 8.4 })
    );
    expect(r.situacao).toBe('aprovado');
  });

  it('formata com 2 casas, truncando sem arredondar', () => {
    expect(formatarNota(5.666)).toBe('5,66');
    expect(formatarNota(13 / 3)).toBe('4,33');
    expect(formatarNota(8)).toBe('8,00');
    expect(formatarNota(7.6 * 0.8 + 9 * 0.2)).toBe('7,88'); // 7,8799999… em float
    expect(formatarNota(null)).toBe('—');
  });

  it('indica com ">" a nota exigida que tem mais de 2 casas', () => {
    expect(formatarNotaExigida(17 / 3)).toBe('> 5,66');
    expect(formatarNotaExigida(8.75)).toBe('8,75');
    expect(formatarNotaExigida(9)).toBe('9,00');
  });

  it('5,66 não basta quando a exigida é 5,666…', () => {
    const r = avaliar(entrada({ n1: 4, n2: 4, n3: 5, n4: 5.66 }));
    expect(r.situacao).toBe('reprovado');
  });
});
