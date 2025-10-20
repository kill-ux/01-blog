import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BlogRequest, BlogResponce, Report } from '../model/model';

@Injectable({
	providedIn: 'root'
})
export class BlogService {
	private API_URL = environment.API_URL;
	constructor(private http: HttpClient) { }

	saveBlog(blogRequest: BlogRequest) {
		return this.http.post<BlogResponce>(`${this.API_URL}/blogs/store`, blogRequest)
	}

	updateBlog(blogRequest: BlogRequest, blogId: string) {
		return this.http.put<BlogResponce>(`${this.API_URL}/blogs/${blogId}/update`, blogRequest)
	}

	getBlogs(cursor: number) {
		return this.http.get<BlogResponce[]>(`${this.API_URL}/blogs?cursor=${cursor}`)
	}

	getBlogsNetworks(cursor: number) {
		return this.http.get<BlogResponce[]>(`${this.API_URL}/blogs/networks?cursor=${cursor}`)
	}

	getBlogsByUserId(userId: any, cursor: number) {
		return this.http.get<BlogResponce[]>(`http://localhost:8080/api/users/${userId}/blogs?cursor=${cursor}`)
	}

	getBlog(blogId: any) {
		return this.http.get<BlogResponce>(`${this.API_URL}/blogs/${blogId}`)
	}

	getBlogChildren(blogId: any, cursor: number) {
		return this.http.get<{ children: BlogResponce[], count: number }>(`${this.API_URL}/blogs/${blogId}/children?cursor=${cursor}`)
	}

	DeleteBlog(blogId: number) {
		return this.http.delete<void>(`${this.API_URL}/blogs/${blogId}/delete`, { responseType: 'text' as 'json' })
	}

	HideBlog(blogId: number) {
		return this.http.patch<void>(`${this.API_URL}/blogs/${blogId}/hide`, { responseType: 'text' as 'json' })
	}

	Report(report: any) {
		return this.http.post<Report>(`${this.API_URL}/reports/store`, report, { responseType: 'text' as 'json' })
	}

	toggleLike(blogResponce: BlogResponce) {
		return this.http.post<{ like: number }>(`${this.API_URL}/blogs/${blogResponce.id}/like`, {})
	}

	uploadFile(file: File) {
		const formData = new FormData();
		formData.append('file', file)
		return this.http.post<{ url: string }>(`${this.API_URL}/upload`, formData)
	}

	// getLikes(blogResponce: BlogResponce) {
	// 	return this.http.get<{count: number}>(`${this.API_URL}/blogs/${blogResponce.id}/likes`, {})
	// }
}
