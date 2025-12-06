import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Component for the internal server error page.
 * This component is displayed when a 500 internal server error occurs.
 */
@Component({
  selector: 'app-internal',
  imports: [RouterLink],
  templateUrl: './internal.html',
  styleUrl: './internal.css',
})
export class Internal {
  
}
