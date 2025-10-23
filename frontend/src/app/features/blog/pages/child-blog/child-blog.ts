import { Component, EventEmitter, inject, Input, OnInit, output, Output } from '@angular/core';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../services/blog-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth-api';
import { environment } from '../../../../../environments/environment';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { dataReport } from '../single-blog/single-blog';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-child-blog',
	imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatMenuModule, MatIcon, MatFormField, MatLabel,MatInputModule],
	templateUrl: './child-blog.html',
	styleUrl: './child-blog.css'
})
export class ChildBlog implements OnInit {
	formCommend: FormGroup
	@Input() child: BlogResponce | null = null;
	@Input() thread: number | null = null


	emitReport = output<dataReport>()

	apiUrl = environment.API_URL

	hidden = false
	reply = false
	edit = false
	isLoading = false
	lastChild = 0;

	public authService = inject(AuthService)

	constructor(private blogService: BlogService, private fb: FormBuilder, private router: Router) {
		this.formCommend = fb.group({
			description: ['', Validators.required],
			parent: [0]
		})
	}

	ngOnInit(): void {
		if (this.child) {
			this.child.children = []
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

	submitComment(id?: number) {
		this.formCommend.markAllAsTouched();
		if (this.formCommend.valid) {
			let comment: any = { description: this.formCommend.value.description, parent: id }
			let obs;
			if (this.edit && this.child) {
				obs = this.blogService.updateBlog(comment, this.child.id.toString())
			} else {
				obs = this.blogService.saveBlog(comment)
			}
			obs.subscribe({
				next: (res) => {
					if (this.edit) {
						this.child = res
						this.child.children = []
						this.edit = false
					} else if (this.child) {
						this.child.children = [res, ...this.child.children]
						this.child.childrenCount++
						this.formCommend.reset()
					}
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

	updateParent(p: { childrenCount: number }) {
		if (this.child) {
			this.child.childrenCount = p.childrenCount
		}
	}

	showReply(toggle?: boolean) {
		if (this.child?.children.length == 0) {
			this.hidden = true
			this.getBlogChildren(0)
		} else if (toggle == undefined) {
			this.hidden = !this.hidden
			if (this.hidden == false) {
				this.reply = false
			}
		} else {
			this.hidden = true
		}
	}

	toggelReply() {
		this.hidden = !this.hidden
	}

	getBlogChildren(cursor: number) {
		if (this.child) {
			if (this.isLoading) return;
			this.isLoading = true;
			this.blogService.getBlogChildren(this.child.id, cursor).subscribe({
				next: (res) => {
					if (this.child && res.children.length > 0) {
						res.children = res.children.map(child => {
							if (child) {
								child.parent = this.child
							}
							return child
						})
						this.child.children = [...this.child.children, ...res.children]
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

	}

	DeleteBlog(id: number) {
		this.blogService.DeleteBlog(id).subscribe({
			next: res => {
				this.child = null
			},
			error: err => {
				console.log(err)
			}
		})
	}

	EditBlog(id: number) {
		this.edit = true
		this.formCommend.patchValue({ description: this.child?.description })
	}

	changeReply() {
		// this.reply = !this.reply
		this.reply = !this.reply
	}


	loadMoreChildren() {
		if (this.lastChild != 0 && !this.isLoading) {
			this.getBlogChildren(this.lastChild);
		}
	}

	openBlog(id: number) {
		this.router.navigate(["blog", id])
	}

	ReportBlog(data: dataReport) {
		this.emitReport.emit(data)
	}

	// EmmitReport(data: dataReport) {
	// 	this.ReportBlog(data.id, data.e, data.menuTrigger)
	// }
}
