import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { GlobalErrorHandler } from './core/services/global-error-handler/global-error-handler';


export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(
			withFetch(),
			withInterceptors([authInterceptor])
		),
		provideRouter(routes),
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler
		},
		provideMarkdown()
	]
};
