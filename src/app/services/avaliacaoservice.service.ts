import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoserviceService {
  private notas = {
    N1: null as number | null,
    N2: null as number | null,
    N3: null as number | null,
    N4: null as number | null,
  };

  private feedbackSubject = new BehaviorSubject<string>('');
  feedback$ = this.feedbackSubject.asObservable();

  setNota(tipo: 'N1' | 'N2' | 'N3' | 'N4', valor: number) {
    if (!this.podePreencherNota(tipo)) {
      return;
    }

    if (this.notas[tipo] !== null) {
      return;
    }

    this.notas[tipo] = valor;
    this.atualizarFeedback(tipo);
  }

  podePreencherNota(tipo: 'N1' | 'N2' | 'N3' | 'N4'): boolean {
    if (tipo === 'N1') return this.notas.N1 === null;
    if (tipo === 'N2') return this.notas.N1 !== null && this.notas.N2 === null;
    if (tipo === 'N3') return this.notas.N2 !== null && this.notas.N3 === null;
    if (tipo === 'N4') return this.notas.N3 !== null && this.notas.N4 === null;
    return false;
  }

  getNota(tipo: 'N1' | 'N2' | 'N3' | 'N4'): number | null {
    return this.notas[tipo];
  }

  private atualizarFeedback(tipo: 'N1' | 'N2' | 'N3' | 'N4') {
    let mensagem = '';
    const { N1, N2, N3, N4 } = this.notas;

    if (tipo === 'N1' && N1 !== null) {
      const mediaParaPassar = 8 * 2 - N1;
      mensagem = `Sua nota em N1 foi ${N1.toFixed(1)}.\n`;
      mensagem += mediaParaPassar <= 10
        ? `Para passar direto, você precisa tirar ${mediaParaPassar.toFixed(1)} na N2.`
        : 'Não é possível passar direto mesmo que você tire 10 na N2.';
    }
    else if (tipo === 'N2' && N2 !== null) {
      const mediaN2 = (N1! + N2) / 2;
      mensagem = `Sua média até N2 é ${mediaN2.toFixed(1)}.\n`;

      if (mediaN2 >= 8) {
        mensagem += 'Parabéns, você foi aprovado na disciplina!';
      } else {
        const notaNecessariaN3 = Math.max(0, 15 - (N1! + N2));
        if (notaNecessariaN3 > 10) {
          mensagem += `Você precisaria tirar ${notaNecessariaN3.toFixed(1)} na N3. Infelizmente, você está reprovado.`;
        } else {
          mensagem += `Você precisa tirar pelo menos ${notaNecessariaN3.toFixed(1)} na N3 para tentar passar.\nAtenção: Se tirar menos que 3 na N3, estará reprovado na disciplina.`;
        }
      }
    }
    else if (tipo === 'N3' && N3 !== null) {
      const mediaAteN3 = (N1! + N2! + N3) / 3;
      mensagem = `Sua nota em N3 foi ${N3.toFixed(1)}.\n`;

      if (mediaAteN3 >= 5) {
        mensagem += 'Parabéns, você foi aprovado na disciplina!';
      } else if (mediaAteN3 < 3) {
        mensagem += 'Infelizmente, você foi reprovado na disciplina e não pode fazer a N4.';
      } else {
        const notaNecessariaN4 = Math.max(0, (5 * 2) - mediaAteN3);
        mensagem += `Você precisa tirar pelo menos ${notaNecessariaN4.toFixed(1)} na N4 para ser aprovado.`;
      }
    }
    else if (tipo === 'N4' && N4 !== null) {
      const mediaAteN3 = (N1! + N2! + N3!) / 3;
      const mediaFinal = (mediaAteN3 + N4) / 2;
      mensagem = `Sua nota em N4 foi ${N4.toFixed(1)}.\n`;
      mensagem += mediaFinal >= 5
        ? 'Parabéns, você foi aprovado na disciplina!'
        : 'Infelizmente, você foi reprovado na disciplina.';
    }

    const mensagensAtuais = this.feedbackSubject.value.trim();
    const novaMensagem = mensagensAtuais
      ? `${mensagensAtuais}\n\n${mensagem}`
      : mensagem;

    this.feedbackSubject.next(novaMensagem);
  }
}
