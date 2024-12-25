import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Resultadon1Service {
  private resultadoN1Source = new BehaviorSubject<number | null>(null);
  resultadoN1$ = this.resultadoN1Source.asObservable();
  setResultadoN1(resultado: number) {
    this.resultadoN1Source.next(resultado);
  }

  constructor() {}
}
