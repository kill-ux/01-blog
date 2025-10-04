import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';

import sanitizeHtml from 'sanitize-html';
import { MarkdownComponent } from "ngx-markdown";

@Component({
	selector: 'app-blogs',
	imports: [DatePipe, MarkdownComponent],
	templateUrl: './blogs.html',
	styleUrl: './blogs.css'
})
export class Blogs implements OnInit {
	// private 
	public blogs: BlogResponce[];
	public lastBlog = 0;
	private isLoading = false;
	constructor(private blogService: BlogService) {
		this.blogs = [];
	}

	ngOnInit(): void {
		console.log("feeds")
		this.loadBlogs(0)
	}

	loadBlogs(cursor: number) {
		if (this.isLoading) return;
		this.isLoading = true;
		this.blogService.getBlogsNetworks(cursor).subscribe({
			next: (res) => {
				console.log("res", res)
				this.blogs = [...this.blogs, ...res];
				if (res.length > 0) {
					this.lastBlog = res[res.length - 1].id;
				} else {
					this.lastBlog = 0;
				}

				console.log(this.blogs)
				this.isLoading = false;
			},
			error: (err) => {
				console.log(err)
				this.isLoading = false;
			}
		})

	}

	loadMoreBlogs() {
		if (this.lastBlog !== 0 && !this.isLoading) {
			this.loadBlogs(this.lastBlog);
		}
		// this.lastBlog = 0
		console.log("aa")
	}

	sanitizeHtml(text: string) {
		return sanitizeHtml(this.blogs[0].description, {
			allowedTags: ALLOWED_TAGS,
			allowedAttributes: { 'a': ['href'], 'img': ['src'] }
		})
	}

	toggleLike(blogResponce: BlogResponce) {
		this.blogService.toggleLike(blogResponce).subscribe({
			next: res => {
				console.log(res)
			},
			error: err => {
				console.log(err)
			}
		})
	}

	// getLikes(blogResponce: BlogResponce) {
	// 	return this.blogService.getLikes(blogResponce).subscribe({
	// 		next: res => {
	// 			console.log(res)
	// 			return res.count
	// 		},
	// 		error: err => {
	// 			console.log(err)
	// 			return 0
	// 		}
	// 	})
	// }
}



const ALLOWED_TAGS = [
	'h1', 'h2', 'h3', 'b', 'i', 'em', 'strong', 'u',
	'p', 'br', 'span', 'div',
	'ul', 'ol', 'li',
	'a', 'img', 'video',
	'blockquote',
	'code', 'pre'
]

// const ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class', 'style']
