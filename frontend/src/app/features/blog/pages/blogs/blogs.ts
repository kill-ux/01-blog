import { Component, inject, Input, OnChanges, OnInit, Signal, signal, SimpleChanges } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../../auth/services/auth-api';
import { User } from '../../../auth/models/model';
import { environment } from '../../../../../environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialog } from '../../../../layouts/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
	snackBar = inject(MatSnackBar)

	apiUrl = environment.API_URL;


	constructor(private blogService: BlogService, private router: Router, public dialog: MatDialog) {
	}

	ngOnInit(): void {
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
				this.blogs.update(bs => [...bs, ...res])
				if (res.length > 0) {
					this.lastBlog = res[res.length - 1].id;
				} else {
					this.lastBlog = 0;
				}
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
	}

	toggleLike(blogResponce: BlogResponce) {
		this.blogService.toggleLike(blogResponce).subscribe({
			next: res => {
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
		this.openConfirmDialog(() => {
			this.blogService.DeleteBlog(id).subscribe({
				next: res => {
					this.blogs.update(bs => bs.filter(blog => blog.id != id))
				},
				error: err => {
					console.log(err)
				}
			})
		})
	}

	HideBlog(id: number) {
		this.openConfirmDialog(() => {
			this.blogService.HideBlog(id).subscribe({
				next: res => {
					this.blogs.update(bs => {
						const blog = bs.find(blog => blog.id == id)
						if (blog) {
							blog.hidden = !blog.hidden
						}
						return bs
					})
				},
				error: err => {
					console.log(err)
				}
			})
		})
	}

	EditBlog(id: number) {
		this.router.navigate(["edit", id])
	}

	ReportBlog(id: number, e: HTMLTextAreaElement, menuTrigger: MatMenuTrigger, menuTrigger1: MatMenuTrigger) {
		this.openConfirmDialog(() => {
			const value = e.value.trim();
			if (value.length == 0) return
			this.blogService.Report({ blogId: id, reason: value }).subscribe({
				next: res => {
					e.value = ''
					this.snackBar.open(`Operation succeced: Report`, "Close", {
						duration: 2000,
					});
				},
				error: err => {
					console.log(err)
				}
			})
			menuTrigger.closeMenu()
			menuTrigger1.closeMenu()
		})
	}

	openUser(id: number) {
		this.router.navigate(["profile", id])
	}

	openConfirmDialog(callback: (() => void)): void {
		const dialogRef = this.dialog.open(ConfirmDialog);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				callback()
			}
		});
	}

}

// const ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class', 'style']
