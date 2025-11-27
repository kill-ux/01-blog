import { Component, ErrorHandler, inject, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-global-error-handler',
	imports: [],
	templateUrl: './global-error-handler.html',
	styleUrl: './global-error-handler.css',
})
export class GlobalErrorHandler implements ErrorHandler {
    private router = inject(Router)

	handleError(error: any): void {
		if (error.message && error.message.includes('NG04002')) {
			this.router.navigate(['/not-found']);
		} else {
			console.log('An unexpected error occurred:', error);
		}
	}
}
