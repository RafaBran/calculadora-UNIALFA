//recursos angular
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//recursos PrimeNG
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';

//componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { N1Component } from './shared/components/n1/n1.component';
import { N2Component } from './shared/components/n2/n2.component';
import { N3Component } from './shared/components/n3/n3.component';
import { N4Component } from './shared/components/n4/n4.component';
import { CalculadoraComponent } from './shared/components/calculadora/calculadora.component';
import { FeedbackComponent } from './shared/components/feedback/feedback.component';
import { DeferModule } from 'primeng/defer';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CalculadoraComponent,
    FeedbackComponent,
    N1Component,
    N2Component,
    N3Component,
    N4Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    RippleModule,
    InputNumberModule,
    FormsModule,
    CardModule,
    TabViewModule,
    DeferModule,
    ScrollTopModule,
    ScrollPanelModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
