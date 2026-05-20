import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { OportunidadesComponent } from './components/oportunidades/oportunidades.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, OportunidadesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
