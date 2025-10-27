import { Component, ErrorHandler, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-global-error-handler',
	imports: [],
	templateUrl: './global-error-handler.html',
	styleUrl: './global-error-handler.css',
})
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private injector: Injector) {

	}

	handleError(error: any): void {
		const router = this.injector.get(Router);
		if (error.message && error.message.includes('NG04002')) {
			console.log('Router Error: Cannot match route. Redirecting to 404.', error);
			router.navigate(['/not-found']);
		} else {
			console.error('An unexpected error occurred:', error);
		}
	}
}
