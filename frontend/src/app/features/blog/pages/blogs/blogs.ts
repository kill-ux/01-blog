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
	constructor(private blogService: BlogService) {
		this.blogs = [];
	}

	ngOnInit(): void {
		console.log("feeds")
		this.loadBlogs()
	}

	loadBlogs() {
		this.blogService.getBlogsNetworks().subscribe({
			next: (res) => {
				console.log("res", res)
				this.blogs = res;
				console.log(this.blogs)
			},
			error: (err) => {
				console.log(err)
			}
		})
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
