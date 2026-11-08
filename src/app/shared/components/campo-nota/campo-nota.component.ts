import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NOTA_MAXIMA, NOTA_MINIMA } from '../../../core/regras-avaliacao';

let proximoId = 0;

/** Campo numérico de 0 a 10 que aceita vírgula ou ponto como separador decimal. */
@Component({
  selector: 'app-campo-nota',
  templateUrl: './campo-nota.component.html',
  styleUrls: ['./campo-nota.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampoNotaComponent implements OnChanges {
  @Input() rotulo = '';
  @Input() dica = '';
  @Input() valor: number | null = null;
  @Input() desabilitado = false;
  /** Incrementado pelo pai para forçar a limpeza do campo (inclusive de texto inválido). */
  @Input() versao = 0;
  @Output() valorChange = new EventEmitter<number | null>();

  readonly id = `campo-nota-${proximoId++}`;
  texto = '';
  erro = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['versao'] && !changes['versao'].firstChange) {
      this.texto = this.valor === null ? '' : String(this.valor).replace('.', ',');
      this.erro = '';
      return;
    }
    // Sincroniza o texto apenas quando o valor muda "de fora" (ex.: botão limpar).
    if (changes['valor'] && this.valor !== this.interpretar(this.texto).valor) {
      this.texto = this.valor === null ? '' : String(this.valor).replace('.', ',');
      this.erro = '';
    }
  }

  aoDigitar(texto: string): void {
    this.texto = texto;
    const { valor, erro } = this.interpretar(texto);
    this.erro = erro;
    this.valorChange.emit(valor);
  }

  aoSair(): void {
    const { valor } = this.interpretar(this.texto);
    if (valor !== null) this.texto = String(valor).replace('.', ',');
  }

  private interpretar(texto: string): { valor: number | null; erro: string } {
    const limpo = texto.trim().replace(',', '.');
    if (limpo === '') return { valor: null, erro: '' };
    if (!/^\d{0,2}(\.\d{0,2})?$/.test(limpo) || limpo === '.') {
      return { valor: null, erro: 'Use um número com até 2 casas decimais.' };
    }
    const valor = Number(limpo);
    if (valor < NOTA_MINIMA || valor > NOTA_MAXIMA) {
      return { valor: null, erro: 'A nota deve estar entre 0 e 10.' };
    }
    return { valor, erro: '' };
  }
}
