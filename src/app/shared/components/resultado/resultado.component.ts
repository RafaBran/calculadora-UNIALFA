import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ARQUIVO_RESOLUCAO, URL_RESOLUCAO } from '../../../core/resolucao';
import { formatarNota, formatarNotaExigida, Resultado } from '../../../core/regras-avaliacao';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadoComponent {
  @Input() resultado!: Resultado;

  readonly formatar = formatarNota;
  readonly formatarExigida = formatarNotaExigida;
  readonly urlResolucao = URL_RESOLUCAO;
  readonly arquivoResolucao = ARQUIVO_RESOLUCAO;

  get titulo(): string {
    switch (this.resultado.situacao) {
      case 'aprovado':
        return 'Aprovado';
      case 'reprovado':
        return 'Reprovado';
      default:
        return this.resultado.etapaAtual
          ? `Aguardando ${this.resultado.etapaAtual}`
          : 'Em andamento';
    }
  }

  get indicadores(): { rotulo: string; valor: number | null; destaque?: boolean }[] {
    const r = this.resultado;
    return [
      { rotulo: 'N1', valor: r.n1 },
      { rotulo: 'N2', valor: r.n2 },
      { rotulo: 'Média N1/N2', valor: r.mediaN1N2 },
      { rotulo: 'Média N1/N2/N3', valor: r.mediaN1N2N3 },
      { rotulo: 'Média final', valor: r.mediaFinal, destaque: true },
    ];
  }
}
