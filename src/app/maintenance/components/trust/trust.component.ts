import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trust',
  standalone: false,
  templateUrl: './trust.component.html',
  styleUrl: './trust.component.scss'
})
export class TrustComponent {
  selectedTab = signal<'intern-trust' | 'request-trust'>('intern-trust');

  activeTab = 'intern-trust';

  constructor(private router: Router) {}

  navigate(tab: string) {
    this.activeTab = tab;
    this.router.navigate(['maintenance/trust', tab]);
  }
}
