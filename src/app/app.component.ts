import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MessageDialogComponent],
  template: `
    <router-outlet></router-outlet>
    <misc-message-dialog></misc-message-dialog>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'modern-ecommerce-shop';
  private authService = inject(AuthService);

  ngOnInit() {
    // Check if we have a token but user info hasn't been loaded
    const token = this.authService.getToken();
    const user = this.authService.getUser();

    if (token && !user) {
      // Token exists but user info not loaded, so load it
      this.authService.loadCurrentUser().subscribe({
        error: (error) => {
          console.error('Error loading current user on app init:', error);
          // If loading fails, the user might have an invalid/expired token
          // We could optionally clear the token in this case
          if (error.status === 401) {
            this.authService['clearAuthData']?.();
          }
        }
      });
    }
  }
}