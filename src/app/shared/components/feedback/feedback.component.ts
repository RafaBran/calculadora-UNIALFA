import { Resultadon1Service } from './../../../core/services/resultadon1.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  resultadoN1: number | null = null;
  
  constructor(private resultadon1Service: Resultadon1Service) {}

  ngOnInit(): void {
    this.resultadon1Service.resultadoN1$.subscribe((resultado) => {
      this.resultadoN1 = resultado;
    });
  }
}
