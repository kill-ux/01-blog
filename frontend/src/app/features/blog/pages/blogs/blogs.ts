import { Component, inject, Input, OnChanges, OnInit, Signal, signal, SimpleChanges } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';

import sanitizeHtml from 'sanitize-html';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../../auth/services/auth-api';
import { User } from '../../../auth/models/model';
import { environment } from '../../../../../environments/environment';
import { AdminService } from '../../../admin/services/admin-service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-blogs',
	imports: [DatePipe, MatProgressSpinnerModule, MatButtonModule, MatMenuModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule],
	templateUrl: './blogs.html',
	styleUrl: './blogs.css',
	host: {
		'[class.my-custom-class]': 'true' // Static class
	}
})
export class Blogs implements OnInit, OnChanges {
	// private 
	public blogs = signal<BlogResponce[]>([]);
	public lastBlog = 0;
	private isLoading = false;
	public authService = inject(AuthService)
	@Input() args: { user: User | null } | null = null

	apiUrl = environment.API_URL;


	constructor(private blogService: BlogService, private router: Router) {
	}

	ngOnInit(): void {
		console.log("feeds")
		this.loadBlogs(0)
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['args'] && changes['args'].currentValue !== changes['args'].previousValue) {
			this.blogs.set([]);
			this.lastBlog = 0;
			this.loadBlogs(0);
		}
	}


	loadBlogs(cursor: number) {
		if (this.isLoading) return;
		this.isLoading = true;
		let obs;
		if (this.args) {
			if (this.args.user) {
				obs = this.blogService.getBlogsByUserId(this.args.user.id, cursor)
			} else {
				obs = this.blogService.getBlogs(cursor)
			}
		} else {
			obs = this.blogService.getBlogsNetworks(cursor)
		}
		obs.subscribe({
			next: (res) => {
				console.log("res", res)
				this.blogs.update(bs => [...bs, ...res])
				// this.blogs = [...this.blogs, ...res];
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
		return sanitizeHtml(this.blogs()[0].description, {
			allowedTags: ALLOWED_TAGS,
			allowedAttributes: { 'a': ['href'], 'img': ['src'] }
		})
	}

	toggleLike(blogResponce: BlogResponce) {
		this.blogService.toggleLike(blogResponce).subscribe({
			next: res => {
				console.log(res)
				blogResponce.like = res.like == 1
				blogResponce.likes += res.like;
			},
			error: err => {
				console.log(err)
			}
		})
	}

	clickOnnArcticle(id: number) {
		this.router.navigate(["blog", id])
	}

	copyLink(blogResponce: BlogResponce) {
		const blogUrl = `${window.location.origin}/blog/${blogResponce.id}`
		navigator.clipboard.writeText(blogUrl).then(() => {
			blogResponce.isCopied = true;
			setTimeout(() => {
				blogResponce.isCopied = false;
			}, 1000)
		}).catch(err => {
			console.error('Failed to copy link:', err);
		});
	}

	DeleteBlog(id: number) {
		console.log("delete this id =>", id)
		this.blogService.DeleteBlog(id).subscribe({
			next: res => {
				this.blogs.update(bs => bs.filter(blog => blog.id != id))
				console.log(res)
			},
			error: err => {
				console.log(err)
			}
		})
	}

	HideBlog(id: number) {
		console.log("hide this id =>", id)
		this.blogService.HideBlog(id).subscribe({
			next: res => {
				this.blogs.update(bs => {
					const blog = bs.find(blog => blog.id == id)
					if (blog) {
						blog.hidden = !blog.hidden
					}
					return bs
				})
				console.log(res)
			},
			error: err => {
				console.log(err)
			}
		})
	}

	EditBlog(id: number) {
		this.router.navigate(["edit", id])
	}

	ReportBlog(id: number, reason: string, menuTrigger: MatMenuTrigger) {
		reason = reason.trim();
		if (reason.length == 0) return
		this.blogService.Report({ blogId: id, reason }).subscribe({
			next: res => {
				console.log(res)
			},
			error: err => {
				console.log(err)
			}
		})
		menuTrigger.closeMenu()
	}

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
