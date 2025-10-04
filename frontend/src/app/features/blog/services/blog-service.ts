import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BlogRequest, BlogResponce } from '../model/model';

@Injectable({
	providedIn: 'root'
})
export class BlogService {
	private API_URL = environment.API_URL;
	constructor(private http: HttpClient) { }

	saveBlog(blogRequest: BlogRequest) {
		return this.http.post<BlogResponce>(`${this.API_URL}/blogs/store`, blogRequest)
	}

	getBlogsNetworks(cursor: number) {
		return this.http.get<BlogResponce[]>(`${this.API_URL}/blogs/networks?cursor=${cursor}`)
	}

	toggleLike(blogResponce: BlogResponce) {
		return this.http.post(`${this.API_URL}/blogs/${blogResponce.id}/like`, {})
	}

	// getLikes(blogResponce: BlogResponce) {
	// 	return this.http.get<{count: number}>(`${this.API_URL}/blogs/${blogResponce.id}/likes`, {})
	// }
}
