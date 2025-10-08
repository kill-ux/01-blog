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

	getBlog(blogId: any) {
		return this.http.get<BlogResponce>(`${this.API_URL}/blogs/${blogId}`)
	}

	getBlogChildren(blogId: any, cursor: number) {
		return this.http.get<BlogResponce[]>(`${this.API_URL}/blogs/${blogId}/children?cursor=${cursor}`)
	}

	toggleLike(blogResponce: BlogResponce) {
		return this.http.post<{ like: number }>(`${this.API_URL}/blogs/${blogResponce.id}/like`, {})
	}

	uploadFile(file: File) {
		const formData = new FormData();
		formData.append('file', file)
		return this.http.post<{url: string}>(`${this.API_URL}/upload`, formData)
	}

	// getLikes(blogResponce: BlogResponce) {
	// 	return this.http.get<{count: number}>(`${this.API_URL}/blogs/${blogResponce.id}/likes`, {})
	// }
}
