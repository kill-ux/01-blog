import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { ActivatedRoute } from '@angular/router';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-single-blog',
	imports: [DatePipe, MarkdownComponent, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule],
	templateUrl: './single-blog.html',
	styleUrl: './single-blog.css'
})
export class SingleBlog implements OnInit {
	public blog: any;
	formCommend: FormGroup
	lastChild = 0
	isLoading = false

	constructor(private blogService: BlogService, private route: ActivatedRoute, private fb: FormBuilder) {
		this.formCommend = fb.group({
			description: ['', Validators.required],
			parent: [0]
		})
	}

	ngOnInit(): void {
		this.getBlog()
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

	getBlog() {
		const id = this.route.snapshot.paramMap.get("id");
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
}
