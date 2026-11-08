import { Component } from '@angular/core';
import { URL_RESOLUCAO } from '../../../core/resolucao';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly urlResolucao = URL_RESOLUCAO;
}
