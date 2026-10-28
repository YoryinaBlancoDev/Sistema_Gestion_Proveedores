import { Component, signal, computed,inject } from '@angular/core';
import { Router,RouterOutlet,NavigationEnd, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Header } from './core/header/header';
import { Footer } from './core/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sistema_gestion_proveedores');

  //Muestra header despues del logueo o cualquier pagina que no sea not found
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

    mostrarHeader = signal(true);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        let route = this.activatedRoute;

        // Busca la ruta activa más profunda
        while (route.firstChild) {
          route = route.firstChild;
        }

        // Lee data.hideHeader de la ruta
        const ocultarHeader = route.snapshot.data['hideHeader'] ?? false;

        this.mostrarHeader.set(!ocultarHeader);
      });
    }
}
