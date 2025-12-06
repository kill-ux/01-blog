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

/**
 * Component for displaying a list of blog posts.
 * Supports loading blogs by user, infinite scrolling, liking, deleting, hiding, editing, and reporting blogs.
 */
@Component({
	selector: 'app-blogs',
	imports: [DatePipe, MatProgressSpinnerModule, MatButtonModule, MatMenuModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule],
	templateUrl: './blogs.html',
	styleUrl: './blogs.css',
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


	/**
	 * Constructs the Blogs component.
	 * @param blogService Service for handling blog-related API calls.
	 * @param router Router for navigation.
	 * @param dialog MatDialog for opening confirmation dialogs.
	 */
	constructor(private blogService: BlogService, private router: Router, public dialog: MatDialog) {
	}

	/**
	 * Initializes the component and loads the initial set of blogs.
	 */
	ngOnInit(): void {
		this.loadBlogs(0)
	}

	/**
	 * Handles changes to input properties, specifically when the `args` input changes.
	 * Resets the blog list and reloads blogs if the user argument changes.
	 * @param changes Object containing current and previous property values.
	 */
	ngOnChanges(changes: SimpleChanges): void {
		if (changes['args'] && changes['args'].currentValue !== changes['args'].previousValue) {
			this.blogs.set([]);
			this.lastBlog = 0;
			this.loadBlogs(0);
		}
	}

	/**
	 * Loads a batch of blog posts from the server.
	 * Supports loading blogs by user ID or general blogs, with pagination.
	 * @param cursor The ID of the last blog loaded, used for pagination.
	 */
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

	/**
	 * Loads more blog posts when the user scrolls or requests more.
	 * Only loads if not already loading and there are more blogs to load.
	 */
	loadMoreBlogs() {
		if (this.lastBlog !== 0 && !this.isLoading) {
			this.loadBlogs(this.lastBlog);
		}
	}

	/**
	 * Toggles the like status of a blog post.
	 * Sends a request to the server to update the like count and status.
	 * @param blogResponce The blog post to like/unlike.
	 */
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

	/**
	 * Navigates to the detailed view of a single blog post.
	 * @param id The ID of the blog post to view.
	 */
	clickOnnArcticle(id: number) {
		this.router.navigate(["blog", id])
	}

	/**
	 * Copies the link to a blog post to the clipboard.
	 * @param blogResponce The blog post whose link is to be copied.
	 */
	copyLink(blogResponce: BlogResponce) {
		const blogUrl = `${window.location.origin}/blog/${blogResponce.id}`
		navigator.clipboard.writeText(blogUrl).then(() => {
			blogResponce.isCopied = true;
			setTimeout(() => {
				blogResponce.isCopied = false;
			}, 1000)
		}).catch(err => {
			console.log('Failed to copy link:', err);
		});
	}

	/**
	 * Deletes a blog post after user confirmation.
	 * @param id The ID of the blog post to delete.
	 */
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

	/**
	 * Hides or unhides a blog post after user confirmation.
	 * @param id The ID of the blog post to hide/unhide.
	 */
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

	/**
	 * Navigates to the edit page for a specific blog post.
	 * @param id The ID of the blog post to edit.
	 */
	EditBlog(id: number) {
		this.router.navigate(["edit", id])
	}

	/**
	 * Reports a blog post after user confirmation.
	 * @param id The ID of the blog post to report.
	 * @param e The textarea element containing the report reason.
	 * @param menuTrigger The MatMenuTrigger for the reporting menu.
	 * @param menuTrigger1 Another MatMenuTrigger (possibly for a parent menu).
	 */
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

	/**
	 * Navigates to a user's profile page.
	 * @param id The ID of the user to view.
	 */
	openUser(id: number) {
		this.router.navigate(["profile", id])
	}

	/**
	 * Opens a confirmation dialog and executes a callback function if confirmed.
	 * @param callback The function to execute upon confirmation.
	 */
	openConfirmDialog(callback: (() => void)): void {
		const dialogRef = this.dialog.open(ConfirmDialog);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				callback()
			}
		});
	}

}
