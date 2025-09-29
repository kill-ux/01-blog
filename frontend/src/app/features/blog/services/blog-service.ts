import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class BlogService {
	private API_URL = environment.API_URL;
	constructor(private http: HttpClient) { }

	getBlogsNetworks() {
		return this.http.get(`${this.API_URL}/networks`)
	}
}
