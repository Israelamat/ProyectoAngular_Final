import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthServiceService } from '../../auth/services/auth-service.service';
@Component({
  selector: 'post-menu',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive,RouterOutlet],
  templateUrl: './post-menu.component.html',
  styleUrl: './post-menu.component.css'
})

export class PostMenuComponent {

  #router=inject(Router);
  #authService = inject(AuthServiceService);
  logged = computed(() => this.#authService.logged());


  logout(event:Event) {
    event.preventDefault();
    this.#authService.logout();
    this.#router.navigate(['/login']);
  }
  
}
