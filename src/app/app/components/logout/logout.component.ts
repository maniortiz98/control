import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  private readonly route = inject(ActivatedRoute);

  protected loading = false;

  ngOnInit(): void {
    this.loading = this.route.snapshot.data['temp'];
  }

}
