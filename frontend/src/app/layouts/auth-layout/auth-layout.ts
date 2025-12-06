import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Component for the authentication layout.
 * This component provides a common layout for authentication-related pages (e.g., login, signup).
 */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css'
})
export class AuthLayout {
    
}
