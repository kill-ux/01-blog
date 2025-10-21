import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth-api';
import { ChildBlog } from "../child-blog/child-blog";
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-single-blog',
	imports: [DatePipe, MarkdownComponent, ReactiveFormsModule, MatProgressSpinnerModule, MatButtonModule, MatMenuModule, MatIcon, ChildBlog, MatInputModule],
	templateUrl: './single-blog.html',
	styleUrl: './single-blog.css'
})
export class SingleBlog implements OnInit {
	public blog: any;
	formCommend: FormGroup
	lastChild = 0
	isLoading = false
	apiUrl = environment.API_URL

	snackBar = inject(MatSnackBar)
	public authService = inject(AuthService)

	constructor(private blogService: BlogService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
		this.formCommend = fb.group({
			description: ['', Validators.required],
			parent: [0]
		})
	}

	ngOnInit(): void {
		const id = this.route.params.subscribe(params => {
			const id = params["id"];
			this.getBlog(id)
		});
	}

	toggleLike(blogResponce: BlogResponce) {
		if (this.isLoading) return;
		this.isLoading = true;

		this.blogService.toggleLike(blogResponce).subscribe({
			next: res => {
				console.log(res)
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

	getBlog(id: number) {
		this.blogService.getBlog(id).subscribe({
			next: (res) => {
				this.blog = res
				this.blog.children = []
				this.getBlogChildren(0)
			},
			error: (err) => {
				console.log(err)
			}
		})
	}

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

	loadMoreChildren() {
		if (this.lastChild != 0 && !this.isLoading) {
			this.getBlogChildren(this.lastChild);
		}
	}

	submitComment() {
		if (this.isLoading) return;
		this.isLoading = true;
		this.formCommend.markAllAsTouched();

		if (this.formCommend.valid) {
			let comment: any = { description: this.formCommend.value.description, parent: this.blog.id }
			this.blogService.saveBlog(comment).subscribe({
				next: (res) => {
					this.blog.children = [res, ...this.blog.children]
					this.formCommend.reset()
					this.isLoading = false
				},
				error: (err) => {
					console.log(err)
					this.isLoading = false
					this.snackBar.open('comment faild', "Close", {
						duration: 2000,
					});
				}
			})

		}
	}

	onKeyDown(e: KeyboardEvent, btn: HTMLButtonElement) {
		if (!e.shiftKey && e.key == "Enter") {
			btn.click()
		}
	}

	DeleteBlog(id: number) {
		if (this.isLoading) return;
		this.isLoading = true;
		this.blogService.DeleteBlog(id).subscribe({
			next: res => {
				this.router.navigate([""])
				this.isLoading = false
			},
			error: err => {
				console.log(err)
				this.isLoading = false
			}
		})
	}

	ReportBlog(id: number, e: HTMLTextAreaElement, menuTrigger: MatMenuTrigger) {
		if (this.isLoading) return
		this.isLoading = true
		const value = e.value.trim();
		if (value.length == 0) return
		this.blogService.Report({ blogId: id, reason: value }).subscribe({
			next: res => {
				console.log(res)
				e.value = ''
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
	}

	EditBlog(id: number) {
		this.router.navigate(["edit", id])
	}

	openUser(id: number) {
		this.router.navigate(["profile", id])
	}

}
