import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth-api';
import { ChildBlog } from "../child-blog/child-blog";
import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'app-single-blog',
	imports: [DatePipe, MarkdownComponent, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, MatButtonModule, MatMenuModule, MatIcon, ChildBlog],
	templateUrl: './single-blog.html',
	styleUrl: './single-blog.css'
})
export class SingleBlog implements OnInit {
	public blog: any;
	formCommend: FormGroup
	lastChild = 0
	isLoading = false
	apiUrl = environment.API_URL
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
			}
		})
	}

	loadMoreChildren() {
		if (this.lastChild != 0 && !this.isLoading) {
			this.getBlogChildren(this.lastChild);
		}
	}

	submitComment() {
		console.log(this.formCommend.value.description)
		console.log("submit")
		this.formCommend.markAllAsTouched();

		if (this.formCommend.valid) {
			let comment: any = { description: this.formCommend.value.description, parent: this.blog.id }
			this.blogService.saveBlog(comment).subscribe({
				next: (res) => {
					console.log("ok")
					console.log(res)
					this.blog.children = [res, ...this.blog.children]
					this.formCommend.reset()
				},
				error: (err) => {
					console.log(err)
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
		console.log("delete this id =>", id)
		this.blogService.DeleteBlog(id).subscribe({
			next: res => {
				console.log(res)
				this.router.navigate([""])
			},
			error: err => {
				console.log(err)
			}
		})
	}

	EditBlog(id: number) {
		this.router.navigate(["edit", id])
	}

	openUser(id: number) {
		this.router.navigate(["profile", id])
	}

}
