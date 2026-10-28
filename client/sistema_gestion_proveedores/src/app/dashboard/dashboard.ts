import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { Subject, takeUntil } from 'rxjs';

import {
  AuthenticationService,
  UsuarioAutenticado
} from '../shared/authentication.service';

import { GenericService } from '../shared/generic';


// =========================
// IMPORTS PARA GRÁFICO
// =========================

import {
  ChartConfiguration,
  ChartData,
  ChartType
} from 'chart.js';

import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables
} from 'ng2-charts';


// =========================
// INTERFACES
// =========================

interface DashboardResumen {

  proveedores: {
    total: number;
    activos: number;
    enEvaluacion: number;
    suspendidos: number;
  };

  evaluaciones: {
    total: number;
    promedioGeneral: number;
    proveedoresPromedioAlto: number;
    proveedoresSinEvaluacion: number;
  };

  contactos: {
    total: number;
    proveedoresSinContactoPrincipal: number;
  };

  topProveedores: {
    id_proveedor: number;
    nombre_empresa: string;
    promedio: number;
    cantidadEvaluaciones: number;
  }[];

  categorias: {
    id_categoria: number;
    nombre: string;
    cantidad: number;
  }[];

}


// =========================
// COMPONENTE
// =========================

@Component({

  selector: 'app-dashboard',

  standalone: true,

  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    BaseChartDirective
  ],

  providers: [
    provideCharts(
      withDefaultRegisterables()
    )
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'

})
export class DashboardComponent
  implements OnInit, OnDestroy {


  // =========================
  // USUARIO
  // =========================

  usuario: UsuarioAutenticado | null;


  // =========================
  // DASHBOARD
  // =========================

  resumen = signal<DashboardResumen | null>(null);

  cargando = signal(true);


  // =========================
  // TABLA TOP 5
  // =========================

  displayedColumnsTop: string[] = [
    'posicion',
    'proveedor',
    'promedio',
    'evaluaciones'
  ];


  // =========================
  // GRÁFICO
  // =========================

  tipoGrafico: ChartType = 'doughnut';


  datosGrafico = signal<ChartData<'doughnut'>>({

    labels: [
      'Activos',
      'En evaluación',
      'Suspendidos'
    ],

    datasets: [
      {
        data: [0, 0, 0]
      }
    ]

  });


  opcionesGrafico:
    ChartConfiguration<'doughnut'>['options'] = {

      responsive: true,

      maintainAspectRatio: false,

      cutout: '68%',

      plugins: {

        legend: {

          position: 'bottom',

          labels: {

            usePointStyle: true,

            padding: 18

          }

        },

        tooltip: {

          callbacks: {

            label: (context) => {

              const valor =
                context.raw as number;

              return ` ${context.label}: ${valor}`;

            }

          }

        }

      }

    };


  // =========================
  // DESTROY
  // =========================

  private destroy$ =
    new Subject<void>();


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(

    private authService:
      AuthenticationService,

    private router:
      Router,

    private gService:
      GenericService

  ) {

    this.usuario =
      this.authService.currentUserValue;

  }


  // =========================
  // ON INIT
  // =========================

  ngOnInit(): void {

    this.cargarResumen();

  }


  // =========================
  // CARGAR DASHBOARD
  // =========================

  cargarResumen(): void {

    this.cargando.set(true);

    this.gService

      .getByEndpoint<DashboardResumen>(
        'dashboard/resumen'
      )

      .pipe(
        takeUntil(this.destroy$)
      )

      .subscribe({

        next: (respuesta) => {

          // Guardar resumen
          this.resumen.set(respuesta);


          // =========================
          // ACTUALIZAR GRÁFICO
          // =========================

          this.datosGrafico.set({

            labels: [
              'Activos',
              'En evaluación',
              'Suspendidos'
            ],

            datasets: [
              {

                data: [
                  respuesta.proveedores.activos,
                  respuesta.proveedores.enEvaluacion,
                  respuesta.proveedores.suspendidos
                ],

                backgroundColor: [
                  '#9ce0db',
                  '#f4c95d',
                  '#e5989b'
                ],

                borderWidth: 0,

                hoverOffset: 5

              }
            ]

          });


          this.cargando.set(false);

        },


        error: (error) => {

          console.error(
            'Error al cargar resumen del dashboard:',
            error
          );

          this.cargando.set(false);

        }

      });

  }


  // =========================
  // ROLES
  // =========================

  get esAdministrador(): boolean {

    return this.usuario?.rol ===
      'ADMINISTRADOR';

  }


  get esCompras(): boolean {

    return this.usuario?.rol ===
      'COMPRAS';

  }


  get esConsulta(): boolean {

    return this.usuario?.rol ===
      'CONSULTA';

  }


  // =========================
  // NAVEGACIÓN
  // =========================

  irA(ruta: string): void {

    this.router.navigate([ruta]);

  }


  // =========================
  // DESTROY
  // =========================

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}