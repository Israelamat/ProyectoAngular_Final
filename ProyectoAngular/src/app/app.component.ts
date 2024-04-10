import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PostsPageComponent } from './post/posts-page/posts-page.component';
import { PostLoginComponent } from "./auth/post-login/post-login.component";
import { PostMenuComponent } from "./post/post-menu/post-menu.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [CommonModule, RouterOutlet, PostsPageComponent, PostLoginComponent, RouterLink, PostMenuComponent]
})
export class AppComponent {
  title = 'angular-assbook';
}
