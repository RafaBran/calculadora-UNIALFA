import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Resultadon1Service {

  private resultadoN1Source = new BehaviorSubject<number | null>(null);
  resultadoN1$ = this.resultadoN1Source.asObservable();

  private quantoFaltaN2Source = new BehaviorSubject<number | null>(null);
  quantoFaltaN2$ = this.quantoFaltaN2Source.asObservable();

  setResultadoN1(resultado: number) {
    this.resultadoN1Source.next(resultado);
  }
  setQuantoFaltaN2(quantoFalta: number) {
    this.quantoFaltaN2Source.next(quantoFalta);
  }
}
