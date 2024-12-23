import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';

// import { N1Component } from './shared/components/n1/n1.component';
// import { N2Component } from './shared/components/n2/n2.component';
// import { N3Component } from './shared/components/n3/n3.component';
// import { N4Component } from './shared/components/n4/n4.component';

const routes: Routes = [
  {path: '', component: HomeComponent,},

  // {path: 'n1', component: N1Component,},
  // {path: 'n2', component: N2Component,},
  // {path: 'n3', component: N3Component,},
  // {path: 'n4', component: N4Component,},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
