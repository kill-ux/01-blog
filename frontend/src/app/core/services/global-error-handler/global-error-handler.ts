import { Component, ErrorHandler, inject, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Component for handling global errors in the application.
 * Implements the ErrorHandler interface to provide custom error handling.
 */
@Component({
	selector: 'app-global-error-handler',
	imports: [],
	templateUrl: './global-error-handler.html',
	styleUrl: './global-error-handler.css',
})
export class GlobalErrorHandler implements ErrorHandler {
    private router = inject(Router)

	/**
	 * Handles any uncaught errors in the application.
	 * If the error is a routing error (NG04002), it navigates to the 'not-found' page.
	 * Otherwise, it logs the error to the console.
	 * @param error The error object.
	 */
	handleError(error: any): void {
		if (error.message && error.message.includes('NG04002')) {
			this.router.navigate(['/not-found']);
		} else {
			console.log('An unexpected error occurred:', error);
		}
	}
}
