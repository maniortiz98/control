import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  standalone: true,
  styleUrl: './loading.component.scss',
  imports: [MatProgressSpinnerModule]
})
export class LoadingComponent { }
