import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  avaliar,
  ENTRADA_VAZIA,
  EntradaNotas,
  Etapa,
  formatarNota,
  formatarNotaExigida,
  Resultado,
} from '../../../core/regras-avaliacao';

const CHAVE_ARMAZENAMENTO = 'calculadora-unialfa:notas';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculadoraComponent implements AfterViewInit, OnDestroy {
  @ViewChild('painelResultado', { read: ElementRef }) painelResultado?: ElementRef<HTMLElement>;

  entrada: EntradaNotas = this.carregar();
  resultado: Resultado = avaliar(this.entrada);
  /** Incrementado ao limpar, para que os campos descartem até textos inválidos. */
  versao = 0;
  /** Painel de resultado visível na tela (controla a barra de resumo no celular). */
  resultadoVisivel = false;

  readonly formatar = formatarNota;
  private observador?: IntersectionObserver;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get resumoSituacao(): string {
    switch (this.resultado.situacao) {
      case 'aprovado':
        return 'Aprovado';
      case 'reprovado':
        return 'Reprovado';
      default:
        return this.resultado.etapaAtual ? `Aguardando ${this.resultado.etapaAtual}` : 'Em andamento';
    }
  }

  get resumoMeta(): string {
    const meta = this.resultado.metas[0];
    if (meta) {
      if (meta.nota === null) return `${meta.etapa}: aprovação impossível nesta etapa`;
      return meta.nota === 0
        ? `${meta.etapa}: qualquer nota aprova`
        : `Precisa de ${formatarNotaExigida(meta.nota)} na ${meta.etapa}`;
    }
    return this.resultado.mediaFinal !== null
      ? `Média final ${formatarNota(this.resultado.mediaFinal)}`
      : 'Ver detalhes';
  }

  ngAfterViewInit(): void {
    const alvo = this.painelResultado?.nativeElement;
    if (!alvo || typeof IntersectionObserver === 'undefined') return;
    this.observador = new IntersectionObserver(([registro]) => {
      this.resultadoVisivel = registro.isIntersecting;
      this.cdr.markForCheck();
    });
    this.observador.observe(alvo);
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
  }

  atualizar<K extends keyof EntradaNotas>(campo: K, valor: EntradaNotas[K]): void {
    this.entrada = { ...this.entrada, [campo]: valor };
    this.resultado = avaliar(this.entrada);
    this.salvar();
  }

  limpar(): void {
    this.entrada = { ...ENTRADA_VAZIA };
    this.resultado = avaliar(this.entrada);
    this.versao++;
    this.salvar();
  }

  irParaResultado(): void {
    this.painelResultado?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  estado(etapa: Etapa): 'atual' | 'concluida' | 'bloqueada' | 'pendente' {
    const r = this.resultado;
    if (!r.etapasHabilitadas[etapa]) return 'bloqueada';
    if (r.etapaAtual === etapa) return 'atual';
    const nota = { N1: r.n1, N2: r.n2, N3: r.n3, N4: r.n4 }[etapa];
    return nota !== null ? 'concluida' : 'pendente';
  }

  motivoBloqueio(etapa: 'N3' | 'N4'): string {
    const r = this.resultado;
    if (!this.entrada.frequenciaMinima) return 'Não se aplica: reprovado por frequência.';
    if (r.situacao === 'aprovado') return 'Não é necessária: você já foi aprovado.';
    if (r.situacao === 'reprovado') return 'Não se aplica: a situação já está definida.';
    return etapa === 'N3'
      ? 'Liberada após N1 e N2, se a média ficar entre 3 e 8.'
      : 'Liberada após a N3, se a média N1/N2/N3 ficar entre 3 e 5.';
  }

  private carregar(): EntradaNotas {
    try {
      const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
      if (salvo) return { ...ENTRADA_VAZIA, ...JSON.parse(salvo) };
    } catch {
      // armazenamento indisponível (modo privado, bloqueado etc.)
    }
    return { ...ENTRADA_VAZIA };
  }

  private salvar(): void {
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(this.entrada));
    } catch {
      // ignora: a calculadora funciona sem persistência
    }
  }
}
