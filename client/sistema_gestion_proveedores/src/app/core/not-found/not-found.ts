import { Component,OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-not-found',
  imports: [MatGridListModule,MatButtonModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound implements OnInit{
  constructor(private location: Location) { } 
  ngOnInit(): void { } 
  Regresar() { // Redireccionar a la ruta raíz 
   this.location.back();
  }
}
