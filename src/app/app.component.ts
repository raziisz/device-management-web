import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatButtonModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'device-management-web';

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onLinkClick() {
    if (this.menuOpen && window.innerWidth <= 768) {
      this.toggleMenu();
    }
  }
}
