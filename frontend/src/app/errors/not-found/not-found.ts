import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Component for the not found page.
 * This component is displayed when a route is not found.
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {

}
