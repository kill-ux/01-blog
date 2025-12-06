import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BlogRequest, BlogResponce, Report } from '../model/model';

/**
 * Service for interacting with the blog API.
 * Provides methods for creating, retrieving, updating, and deleting blog posts,
 * as well as handling likes, reports, and file uploads.
 */
@Injectable({
	providedIn: 'root'
})
export class BlogService {
	private API_URL = environment.API_URL;
    private http = inject(HttpClient)

	/**
	 * Saves a new blog post to the server.
	 * @param blogRequest The blog post data to save.
	 * @returns An Observable of the created BlogResponce.
	 */
	saveBlog(blogRequest: BlogRequest) {
		return this.http.post<BlogResponce>(`${this.API_URL}/blogs/store`, blogRequest)
	}

	/**
	 * Updates an existing blog post on the server.
	 * @param blogRequest The updated blog post data.
	 * @param blogId The ID of the blog post to update.
	 * @returns An Observable of the updated BlogResponce.
	 */
	updateBlog(blogRequest: BlogRequest, blogId: string) {
		return this.http.put<BlogResponce>(`${this.API_URL}/blogs/${blogId}/update`, blogRequest)
	}

	/**
	 * Retrieves a list of blog posts with pagination.
	 * @param cursor The ID of the last blog retrieved, used for pagination.
	 * @returns An Observable of an array of BlogResponce.
	 */
	getBlogs(cursor: number) {
		return this.http.get<BlogResponce[]>(`${this.API_URL}/blogs?cursor=${cursor}`)
	}

	/**
	 * Retrieves blog posts from the user's network with pagination.
	 * @param cursor The ID of the last blog retrieved, used for pagination.
	 * @returns An Observable of an array of BlogResponce.
	 */
	getBlogsNetworks(cursor: number) {
		return this.http.get<BlogResponce[]>(`${this.API_URL}/blogs/networks?cursor=${cursor}`)
	}

	/**
	 * Retrieves blog posts by a specific user with pagination.
	 * @param userId The ID of the user whose blogs to retrieve.
	 * @param cursor The ID of the last blog retrieved, used for pagination.
	 * @returns An Observable of an array of BlogResponce.
	 */
	getBlogsByUserId(userId: any, cursor: number) {
		return this.http.get<BlogResponce[]>(`${this.API_URL}/users/${userId}/blogs?cursor=${cursor}`)
	}

	/**
	 * Retrieves a single blog post by its ID.
	 * @param blogId The ID of the blog post to retrieve.
	 * @returns An Observable of the BlogResponce.
	 */
	getBlog(blogId: any) {
		return this.http.get<BlogResponce>(`${this.API_URL}/blogs/${blogId}`)
	}

	/**
	 * Retrieves children (comments/replies) for a given blog post with pagination.
	 * @param blogId The ID of the parent blog post.
	 * @param cursor The ID of the last child retrieved, used for pagination.
	 * @returns An Observable containing an array of BlogResponce children and their count.
	 */
	getBlogChildren(blogId: any, cursor: number) {
		return this.http.get<{ children: BlogResponce[], count: number }>(`${this.API_URL}/blogs/${blogId}/children?cursor=${cursor}`)
	}

	/**
	 * Deletes a blog post by its ID.
	 * @param blogId The ID of the blog post to delete.
	 * @returns An Observable that completes when the deletion is successful.
	 */
	DeleteBlog(blogId: number) {
		return this.http.delete<void>(`${this.API_URL}/blogs/${blogId}/delete`, { responseType: 'text' as 'json' })
	}

	/**
	 * Hides a blog post by its ID.
	 * @param blogId The ID of the blog post to hide.
	 * @returns An Observable that completes when the hide operation is successful.
	 */
	HideBlog(blogId: number) {
		return this.http.patch<void>(`${this.API_URL}/blogs/${blogId}/hide`, { responseType: 'text' as 'json' })
	}

	/**
	 * Submits a report for a blog post.
	 * @param report The report object containing blogId and reason.
	 * @returns An Observable of the created Report.
	 */
	Report(report: any) {
		return this.http.post<Report>(`${this.API_URL}/reports/store`, report, { responseType: 'text' as 'json' })
	}

	/**
	 * Toggles the like status for a blog post.
	 * @param blogResponce The blog post for which to toggle the like.
	 * @returns An Observable indicating the like status change.
	 */
	toggleLike(blogResponce: BlogResponce) {
		return this.http.post<{ like: number }>(`${this.API_URL}/blogs/${blogResponce.id}/like`, {})
	}

	/**
	 * Uploads a file to the server.
	 * @param file The file to upload.
	 * @returns An Observable containing the URL of the uploaded file.
	 */
	uploadFile(file: File) {
		const formData = new FormData();
		formData.append('file', file)
		return this.http.post<{ url: string }>(`${this.API_URL}/upload`, formData)
	}

	// getLikes(blogResponce: BlogResponce) {
	// 	return this.http.get<{count: number}>(`${this.API_URL}/blogs/${blogResponce.id}/likes`, {})
	// }
}
