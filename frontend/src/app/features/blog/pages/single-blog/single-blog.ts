import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth-api';
import { ChildBlog } from "../child-blog/child-blog";
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialog } from '../../../../layouts/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';

export type dataReport = { id: number, e: HTMLTextAreaElement, menuTrigger: MatMenuTrigger }

/**
 * Component for displaying a single blog post and its comments.
 * Supports viewing, liking, commenting, reporting, editing, and hiding blog posts.
 */
@Component({
	selector: 'app-single-blog',
	imports: [DatePipe, MarkdownComponent, ReactiveFormsModule, MatProgressSpinnerModule, MatButtonModule, MatMenuModule, MatIcon, ChildBlog, MatInputModule],
	templateUrl: './single-blog.html',
	styleUrl: './single-blog.css'
})
export class SingleBlog implements OnInit {
	public blog: BlogResponce | null = null;
	formCommend: FormGroup
	lastChild = 0
	isLoading = false
	apiUrl = environment.API_URL

	snackBar = inject(MatSnackBar)
	public authService = inject(AuthService)

	/**
	 * Constructs the SingleBlog component.
	 * Initializes the comment form and injects necessary services.
	 * @param blogService Service for blog-related API calls.
	 * @param route ActivatedRoute for accessing route parameters.
	 * @param fb FormBuilder for creating the form group.
	 * @param router Router for navigation.
	 * @param dialog MatDialog for opening confirmation dialogs.
	 */
	constructor(private blogService: BlogService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router, public dialog: MatDialog) {
		this.formCommend = fb.group({
			description: ['', Validators.required],
			parent: [0]
		})
	}

	/**
	 * Initializes the component. Fetches the blog post based on the 'id' parameter from the route.
	 */
	ngOnInit(): void {
		this.route.params.subscribe(params => {
			const id = Number(params["id"]);
			if (Number.isNaN(id)) {
				this.router.navigate(["blog-not-found"])
				return
			}
			this.getBlog(id)
		});
	}

	/**
	 * Toggles the like status of the current blog post.
	 * @param blogResponce The blog post to like/unlike.
	 */
	toggleLike(blogResponce: BlogResponce | null) {
		if (this.isLoading || !blogResponce) return;
		this.isLoading = true;

		this.blogService.toggleLike(blogResponce).subscribe({
			next: res => {
				blogResponce.like = res.like == 1
				blogResponce.likes += res.like;
				this.isLoading = false
			},
			error: err => {
				console.log(err)
				this.isLoading = false
				this.snackBar.open('toggle faild', "Close", {
					duration: 2000,
				});
			}
		})
	}

	/**
	 * Fetches a single blog post by its ID.
	 * Also fetches its children (comments).
	 * @param id The ID of the blog post to fetch.
	 */
	getBlog(id: number) {
		this.blogService.getBlog(id).subscribe({
			next: (res) => {
				this.blog = res
				this.blog.children = []
				this.getBlogChildren(0)
			},
			error: (err) => {
				if (err.status == 400) {
					this.router.navigate(["blog-not-found"])
				}
				console.log(err)
			}
		})
	}

	/**
	 * Fetches children (comments) for the current blog post.
	 * Supports pagination using a cursor.
	 * @param cursor The ID of the last child fetched, for pagination.
	 */
	getBlogChildren(cursor: number) {
		if (this.isLoading) return;
		this.isLoading = true;
		this.blogService.getBlogChildren(this.blog?.id, cursor).subscribe({
			next: (res) => {
				if (this.blog && res.children.length > 0) {
					res.children = res.children.map(child => {
						child.parent = this.blog
						return child
					})
					this.blog.children = [...this.blog.children, ...res.children]
					this.lastChild = res.children[res.children.length - 1].id
				} else {
					this.lastChild = 0;
				}
				this.isLoading = false;
			},
			error: (err) => {
				console.log(err)
				this.isLoading = false;
				this.snackBar.open('get childs Faild', "Close", {
					duration: 2000,
				});
			}
		})
	}

	/**
	 * Loads more children (comments) for the current blog post.
	 */
	loadMoreChildren() {
		if (this.lastChild != 0 && !this.isLoading) {
			this.getBlogChildren(this.lastChild);
		}
	}

	/**
	 * Submits a new comment for the current blog post.
	 */
	submitComment() {
		this.formCommend.markAllAsTouched();
		if (this.formCommend.valid && this.blog) {
			if (this.isLoading) return;
			this.isLoading = true;
			let comment: any = { description: this.formCommend.value.description, parent: this.blog.id }
			this.blogService.saveBlog(comment).subscribe({
				next: (res) => {
					if (this.blog) {
						this.blog.children = [res, ...this.blog.children]
						this.formCommend.reset()
					}
					this.isLoading = false
				},
				error: (err) => {
					console.log(err)
					this.isLoading = false
					this.formCommend.reset()
					this.snackBar.open('comment faild', "Close", {
						duration: 2000,
					});
				}
			})

		}
	}

	/**
	 * Handles keydown events on the comment input.
	 * Submits the comment if Enter is pressed without Shift.
	 * @param e KeyboardEvent.
	 * @param btn The submit button element.
	 */
	onKeyDown(e: KeyboardEvent, btn: HTMLButtonElement) {
		if (!e.shiftKey && e.key == "Enter") {
			btn.click()
		}
	}

	/**
	 * Deletes the current blog post after user confirmation.
	 * Navigates to the home page upon successful deletion.
	 * @param id The ID of the blog post to delete.
	 */
	DeleteBlog(id?: number) {
		this.openConfirmDialog(() => {
			if (this.isLoading || !id) return;
			this.isLoading = true;
			this.blogService.DeleteBlog(id).subscribe({
				next: res => {
					this.router.navigate([""])
					this.snackBar.open('Blog is Deleted succefully', "Close", {
						duration: 2000,
					});
					this.isLoading = false
				},
				error: err => {
					console.log(err)
					this.isLoading = false
				}
			})
		})
	}

	/**
	 * Handles a report event emitted from a child component.
	 * @param data The data related to the report, including blog ID, textarea element, and menu trigger.
	 */
	EmmitReport(data: dataReport) {
		this.ReportBlog(data.id, data.e, data.menuTrigger)
	}

	/**
	 * Reports a blog post after user confirmation.
	 * @param id The ID of the blog post to report.
	 * @param e The textarea element containing the report reason.
	 * @param menuTrigger The MatMenuTrigger for the reporting menu.
	 */
	ReportBlog(id: number, e: HTMLTextAreaElement, menuTrigger: MatMenuTrigger) {
		this.openConfirmDialog(() => {
			const value = e.value.trim();
			if (value.length == 0) return
			if (this.isLoading || !id) return
			this.isLoading = true
			this.blogService.Report({ blogId: id, reason: value }).subscribe({
				next: res => {
					e.value = ''
					this.snackBar.open(`Operation succeced: Report`, "Close", {
						duration: 2000,
					});
					this.isLoading = false
				},
				error: err => {
					console.log(err)
					this.isLoading = false
					this.snackBar.open("report faild", "Closa", {
						duration: 2000
					})
				}
			})
			menuTrigger.closeMenu()
		})
	}

	/**
	 * Navigates to the edit page for the current blog post.
	 * @param id The ID of the blog post to edit.
	 */
	EditBlog(id?: number) {
		if (!id) return
		this.router.navigate(["edit", id])
	}

	/**
	 * Navigates to a user's profile page.
	 * @param id The ID of the user to view.
	 */
	openUser(id?: number) {
		if (id) {
			this.router.navigate(["profile", id])
		}
	}

	/**
	 * Hides or unhides the current blog post after user confirmation.
	 * @param id The ID of the blog post to hide/unhide.
	 */
	HideBlog(id?: number) {
		this.openConfirmDialog(() => {
			if (this.isLoading || !id) return
			this.isLoading = true
			this.blogService.HideBlog(id).subscribe({
				next: res => {
					this.snackBar.open('Blog is Hidden succefully', "Close", {
						duration: 2000,
					});
					if (this.blog) {
						this.blog.hidden = !this.blog.hidden
					}
					this.isLoading = false
				},
				error: err => {
					console.log(err)
					this.isLoading = false
				}
			})
		})
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
