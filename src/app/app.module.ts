import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';
import { CalculadoraComponent } from './shared/components/calculadora/calculadora.component';
import { CampoNotaComponent } from './shared/components/campo-nota/campo-nota.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ResultadoComponent } from './shared/components/resultado/resultado.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CalculadoraComponent,
    CampoNotaComponent,
    ResultadoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
