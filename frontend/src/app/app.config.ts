import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer, provideMarkdown } from 'ngx-markdown';
import { Tokens } from 'marked';
export function markedOptionsFactory(): MarkedOptions {
	const renderer = new MarkedRenderer()
	const linkRenderer = renderer.link;
	renderer.link = function (link: Tokens.Link) {
		const html = linkRenderer.call(this, link)
		if (link.href != "") {
			return html.replace(/^<a /, '<a target="_blank" rel="noopener" ')
		}
		return html
	}

	return {
		renderer
	}
}


export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(
			withFetch(),
			withInterceptors([authInterceptor])
		),
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),

		provideMarkdown({
			markedOptions: {
				provide: MARKED_OPTIONS,
				useFactory: markedOptionsFactory
			}
		})
	]
};
