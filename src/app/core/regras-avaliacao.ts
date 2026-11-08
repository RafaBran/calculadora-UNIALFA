/**
 * Regras do sistema de avaliação do ensino-aprendizagem discente da UNIALFA
 * (Resolução nº 063/2023, de 20 de dezembro de 2023 — cursos presenciais).
 *
 * Resumo:
 *  - N1 e N2 = NF × 0,80 + NPRO × 0,20                          (Art. 5º, parágrafo único)
 *  - (N1 + N2) / 2 ≥ 8  → aprovado, dispensado da N3            (Art. 6º)
 *  - (N1 + N2) / 2 < 3  → reprovado por nota                    (Art. 6º)
 *  - caso contrário     → N3 obrigatória                        (Art. 7º)
 *  - (N1 + N2 + N3) / 3 ≥ 5 → aprovado                          (Art. 8º)
 *  - (N1 + N2 + N3) / 3 < 3 → reprovado, sem direito à N4       (Art. 8º)
 *  - caso contrário         → pode fazer a N4 (recuperação)     (Art. 9º)
 *  - [(N1 + N2 + N3) / 3 + N4] / 2 ≥ 5 → aprovado               (Art. 10)
 *  - frequência < 75% → reprovado, independentemente das notas  (Art. 20)
 */

export const PESO_FORMAL = 0.8;
export const PESO_PROCESSUAL = 0.2;
export const NOTA_MINIMA = 0;
export const NOTA_MAXIMA = 10;
export const MEDIA_APROVACAO_DIRETA = 8;
export const MEDIA_APROVACAO = 5;
export const MEDIA_MINIMA_CONTINUAR = 3;

/** Tolerância para comparar números de ponto flutuante (ex.: 0,1 + 0,2). */
const EPSILON = 1e-9;

export type Etapa = 'N1' | 'N2' | 'N3' | 'N4';
export type Situacao = 'em-andamento' | 'aprovado' | 'reprovado';
export type TipoMensagem = 'info' | 'sucesso' | 'alerta' | 'erro';

export interface EntradaNotas {
  n1Formal: number | null;
  n1Processual: number | null;
  n2Formal: number | null;
  n2Processual: number | null;
  n3: number | null;
  n4: number | null;
  /** O aluno atingiu a frequência mínima de 75%? */
  frequenciaMinima: boolean;
}

export interface Mensagem {
  tipo: TipoMensagem;
  texto: string;
  /** Artigo da resolução que fundamenta a mensagem. */
  artigo?: string;
}

export interface Meta {
  etapa: Etapa;
  descricao: string;
  /** Nota mínima necessária na etapa; `null` quando inalcançável. */
  nota: number | null;
  /** Nota formal mínima, considerando a processual já informada (só N1/N2). */
  notaFormal?: number | null;
}

export interface Resultado {
  n1: number | null;
  n2: number | null;
  n3: number | null;
  n4: number | null;
  mediaN1N2: number | null;
  mediaN1N2N3: number | null;
  mediaFinal: number | null;
  situacao: Situacao;
  /** Etapa que o aluno precisa preencher agora; `null` se a situação já está definida. */
  etapaAtual: Etapa | null;
  /** Etapas que se aplicam ao aluno (as demais devem ser desabilitadas). */
  etapasHabilitadas: Record<Etapa, boolean>;
  metas: Meta[];
  mensagens: Mensagem[];
}

export const ENTRADA_VAZIA: EntradaNotas = {
  n1Formal: null,
  n1Processual: null,
  n2Formal: null,
  n2Processual: null,
  n3: null,
  n4: null,
  frequenciaMinima: true,
};

export function notaValida(valor: number | null | undefined): valor is number {
  return (
    typeof valor === 'number' &&
    Number.isFinite(valor) &&
    valor >= NOTA_MINIMA - EPSILON &&
    valor <= NOTA_MAXIMA + EPSILON
  );
}

/** N1 ou N2 = NF × 0,80 + NPRO × 0,20. Retorna `null` se faltar alguma das notas. */
export function calcularNotaComposta(
  formal: number | null,
  processual: number | null
): number | null {
  if (!notaValida(formal) || !notaValida(processual)) return null;
  return formal * PESO_FORMAL + processual * PESO_PROCESSUAL;
}

function maiorOuIgual(a: number, b: number): boolean {
  return a >= b - EPSILON;
}

function menorQue(a: number, b: number): boolean {
  return a < b - EPSILON;
}

/**
 * Converte uma nota exigida (valor exato, sem arredondamento) em uma meta:
 * `null` se for maior que 10 (inalcançável) e 0 se já estiver garantida.
 */
function notaNecessaria(valor: number): number | null {
  if (valor <= EPSILON) return 0;
  return valor > NOTA_MAXIMA + EPSILON ? null : valor;
}

/** Nota formal mínima para que NF × 0,8 + NPRO × 0,2 atinja `alvo`. */
function formalNecessaria(alvo: number, processual: number | null): number | null | undefined {
  if (!notaValida(processual)) return undefined;
  return notaNecessaria((alvo - processual * PESO_PROCESSUAL) / PESO_FORMAL);
}

/** Trunca em 2 casas decimais, sem arredondar (tolerando erro de ponto flutuante). */
export function truncarDuasCasas(valor: number): number {
  return Math.trunc(valor * 100 + EPSILON * 100) / 100;
}

/** Formata o valor exato com 2 casas, truncando (ex.: 4,333… → "4,33"). */
export function formatarNota(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return '—';
  return truncarDuasCasas(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formata uma nota exigida. Se o valor exato tiver mais de 2 casas, exibe "> x,xx",
 * pois a nota truncada não seria suficiente (ex.: 5,666… → "> 5,66").
 */
export function formatarNotaExigida(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return '—';
  const exata = Math.abs(valor - truncarDuasCasas(valor)) <= EPSILON;
  return exata ? formatarNota(valor) : `> ${formatarNota(valor)}`;
}

export function avaliar(entrada: EntradaNotas): Resultado {
  const n1 = calcularNotaComposta(entrada.n1Formal, entrada.n1Processual);
  const n2 = calcularNotaComposta(entrada.n2Formal, entrada.n2Processual);

  const r: Resultado = {
    n1,
    n2,
    n3: null,
    n4: null,
    mediaN1N2: null,
    mediaN1N2N3: null,
    mediaFinal: null,
    situacao: 'em-andamento',
    etapaAtual: 'N1',
    etapasHabilitadas: { N1: true, N2: true, N3: false, N4: false },
    metas: [],
    mensagens: [],
  };

  const reprovadoPorFrequencia = !entrada.frequenciaMinima;

  // ---- N1 ---------------------------------------------------------------
  if (n1 === null) {
    r.mensagens.push({
      tipo: 'info',
      texto:
        'Informe as notas formal e processual da N1. A N1 é calculada como NF × 0,80 + NPRO × 0,20.',
      artigo: 'Art. 5º',
    });
    return aplicarFrequencia(r, reprovadoPorFrequencia);
  }

  // ---- N2 ---------------------------------------------------------------
  if (n2 === null) {
    r.etapaAtual = 'N2';

    const alvoDireto = MEDIA_APROVACAO_DIRETA * 2 - n1;
    const notaDireta = notaNecessaria(alvoDireto);
    r.metas.push({
      etapa: 'N2',
      descricao: 'para ser aprovado direto (média N1/N2 ≥ 8)',
      nota: notaDireta,
      notaFormal: notaDireta === null ? undefined : formalNecessaria(alvoDireto, entrada.n2Processual),
    });

    const alvoN3 = MEDIA_MINIMA_CONTINUAR * 2 - n1;
    const notaN3 = notaNecessaria(alvoN3);
    if (notaN3 !== null && notaN3 > 0) {
      r.metas.push({
        etapa: 'N2',
        descricao: 'para não ser reprovado e ir para a N3 (média N1/N2 ≥ 3)',
        nota: notaN3,
        notaFormal: formalNecessaria(alvoN3, entrada.n2Processual),
      });
    }

    if (notaDireta === null) {
      r.mensagens.push({
        tipo: 'alerta',
        texto:
          'Mesmo com 10 na N2 não é possível ser aprovado direto. Você precisará fazer a N3.',
        artigo: 'Art. 7º',
      });
    }
    r.mensagens.push({
      tipo: 'info',
      texto: 'Informe as notas formal e processual da N2.',
    });
    return aplicarFrequencia(r, reprovadoPorFrequencia);
  }

  // ---- Média N1/N2 ------------------------------------------------------
  const mediaN1N2 = (n1 + n2) / 2;
  r.mediaN1N2 = mediaN1N2;

  if (maiorOuIgual(mediaN1N2, MEDIA_APROVACAO_DIRETA)) {
    r.mediaFinal = mediaN1N2;
    r.situacao = 'aprovado';
    r.etapaAtual = null;
    r.mensagens.push({
      tipo: 'sucesso',
      texto: `Média N1/N2 de ${formatarNota(mediaN1N2)}: aprovado e dispensado da N3.`,
      artigo: 'Art. 6º',
    });
    return aplicarFrequencia(r, reprovadoPorFrequencia);
  }

  if (menorQue(mediaN1N2, MEDIA_MINIMA_CONTINUAR)) {
    r.mediaFinal = mediaN1N2;
    r.situacao = 'reprovado';
    r.etapaAtual = null;
    r.mensagens.push({
      tipo: 'erro',
      texto: `Média N1/N2 de ${formatarNota(mediaN1N2)} (menor que 3): reprovado por nota, sem direito à N3.`,
      artigo: 'Art. 6º',
    });
    return aplicarFrequencia(r, reprovadoPorFrequencia);
  }

  // ---- N3 ---------------------------------------------------------------
  r.etapasHabilitadas.N3 = true;
  const somaN1N2 = n1 + n2;
  const n3 = notaValida(entrada.n3) ? entrada.n3 : null;

  if (n3 === null) {
    r.etapaAtual = 'N3';
    const notaAprovacao = notaNecessaria(MEDIA_APROVACAO * 3 - somaN1N2);
    r.metas.push({
      etapa: 'N3',
      descricao: 'para ser aprovado na N3 (média N1/N2/N3 ≥ 5)',
      nota: notaAprovacao,
    });
    const notaN4 = notaNecessaria(MEDIA_MINIMA_CONTINUAR * 3 - somaN1N2);
    if (notaN4 !== null && notaN4 > 0) {
      r.metas.push({
        etapa: 'N3',
        descricao: 'para não ser reprovado e ter direito à N4 (média N1/N2/N3 ≥ 3)',
        nota: notaN4,
      });
    }
    r.mensagens.push({
      tipo: 'alerta',
      texto: `Média N1/N2 de ${formatarNota(mediaN1N2)} (menor que 8): a N3 é obrigatória.`,
      artigo: 'Art. 7º',
    });
    return aplicarFrequencia(r, reprovadoPorFrequencia);
  }

  r.n3 = n3;
  const mediaN1N2N3 = (somaN1N2 + n3) / 3;
  r.mediaN1N2N3 = mediaN1N2N3;

  if (maiorOuIgual(mediaN1N2N3, MEDIA_APROVACAO)) {
    r.mediaFinal = mediaN1N2N3;
    r.situacao = 'aprovado';
    r.etapaAtual = null;
    r.mensagens.push({
      tipo: 'sucesso',
      texto: `Média N1/N2/N3 de ${formatarNota(mediaN1N2N3)}: aprovado na N3.`,
      artigo: 'Art. 8º',
    });
    return aplicarFrequencia(r, reprovadoPorFrequencia);
  }

  if (menorQue(mediaN1N2N3, MEDIA_MINIMA_CONTINUAR)) {
    r.mediaFinal = mediaN1N2N3;
    r.situacao = 'reprovado';
    r.etapaAtual = null;
    r.mensagens.push({
      tipo: 'erro',
      texto: `Média N1/N2/N3 de ${formatarNota(mediaN1N2N3)} (menor que 3): reprovado, sem direito à N4.`,
      artigo: 'Art. 8º',
    });
    return aplicarFrequencia(r, reprovadoPorFrequencia);
  }

  // ---- N4 (recuperação) -------------------------------------------------
  r.etapasHabilitadas.N4 = true;
  const n4 = notaValida(entrada.n4) ? entrada.n4 : null;

  if (n4 === null) {
    r.etapaAtual = 'N4';
    r.metas.push({
      etapa: 'N4',
      descricao: 'para ser aprovado na recuperação (média final ≥ 5)',
      nota: notaNecessaria(MEDIA_APROVACAO * 2 - mediaN1N2N3),
    });
    r.mensagens.push({
      tipo: 'alerta',
      texto: `Média N1/N2/N3 de ${formatarNota(mediaN1N2N3)}: você tem direito à prova de recuperação (N4).`,
      artigo: 'Art. 9º',
    });
    return aplicarFrequencia(r, reprovadoPorFrequencia);
  }

  r.n4 = n4;
  const mediaFinal = (mediaN1N2N3 + n4) / 2;
  r.mediaFinal = mediaFinal;
  r.etapaAtual = null;

  if (maiorOuIgual(mediaFinal, MEDIA_APROVACAO)) {
    r.situacao = 'aprovado';
    r.mensagens.push({
      tipo: 'sucesso',
      texto: `Média final de ${formatarNota(mediaFinal)}: aprovado na N4.`,
      artigo: 'Art. 10',
    });
  } else {
    r.situacao = 'reprovado';
    r.mensagens.push({
      tipo: 'erro',
      texto: `Média final de ${formatarNota(mediaFinal)} (menor que 5): reprovado por nota.`,
      artigo: 'Art. 10',
    });
  }
  return aplicarFrequencia(r, reprovadoPorFrequencia);
}

function aplicarFrequencia(r: Resultado, reprovadoPorFrequencia: boolean): Resultado {
  if (!reprovadoPorFrequencia) return r;
  r.situacao = 'reprovado';
  r.etapaAtual = null;
  r.metas = [];
  r.etapasHabilitadas.N3 = false;
  r.etapasHabilitadas.N4 = false;
  r.mensagens.unshift({
    tipo: 'erro',
    texto:
      'Frequência inferior a 75%: reprovado na disciplina, independentemente das notas.',
    artigo: 'Art. 20',
  });
  return r;
}
