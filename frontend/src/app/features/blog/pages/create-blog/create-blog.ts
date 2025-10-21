import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MarkdownModule } from 'ngx-markdown';

import { BlogService } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-create-blog',
	imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MarkdownModule],
	templateUrl: './create-blog.html',
	styleUrl: './create-blog.css'
})
export class CreateBlog implements OnInit {
	formBlog: FormGroup;
	isUploading = false;
	id: string | null = null
	snackBar = inject(MatSnackBar)
	// 

	constructor(private fb: FormBuilder, private blogService: BlogService, private route: ActivatedRoute, private router: Router) {
		this.formBlog = this.fb.group({
			description: ['', Validators.required],
			title: ['', Validators.required]
		})
	}

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get("id")
		if (this.id) {
			this.getBlog(this.id)
		}
	}

	getBlog(id: string) {
		this.blogService.getBlog(id).subscribe({
			next: (res) => {
				this.formBlog.setValue({
					description: res.description,
					title: res.title
				})
			},
			error: (err) => {
				console.log(err)
			}
		})
	}

	onSubmit() {
		if (this.isUploading) return
		this.isUploading = true;
		console.log("submit")
		this.formBlog.markAllAsTouched();

		if (this.formBlog.valid) {
			console.log("hh")
			let obs;
			if (this.id) {
				obs = this.blogService.updateBlog(this.formBlog.value, this.id)
			} else {
				obs = this.blogService.saveBlog(this.formBlog.value)
			}
			obs.subscribe({
				next: (res) => {
					console.log("ok")
					this.isUploading = false;
					this.router.navigate(['blog', res.id])
					this.snackBar.open('new blog created', "Close", {
						duration: 2000,
					});
				},
				error: (err) => {
					console.log(err)
					this.isUploading = false;
					this.snackBar.open('create blog faild', "Close", {
						duration: 2000,
					});
				}
			})

		}
	}


	async onPaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;


		const pastedText = clipboardData?.getData('text/plain');
		if (pastedText) {
			try {
				const url = new URL(pastedText)
				if (this.isImage(url.pathname)) {
					event.preventDefault()
					this.insertMarkdownImage(pastedText);
				} else if (this.isVideo(url.pathname)) {
					event.preventDefault()
					this.insertMarkdownVideo(pastedText);
				}
			} catch {
				return
			}

		} else {
			if (clipboardData?.items) {
				for (const item of clipboardData?.items) {
					if (item.kind == 'file') {
						event.preventDefault()
						const file = item.getAsFile();
						if (file) {
							// document.execCommand("insertText", false, `![Uploading image](...)`)
							await this.handleFileUpload(file);
						}
					}
				}
			}
		}

	}

	async onDrop(event: DragEvent) {
		event.preventDefault();
		const files = event.dataTransfer?.files;
		if (files) {
			for (const file of files) {
				await this.handleFileUpload(file);
			}
		}

	}




	async handleFileUpload(file: File): Promise<void> {
		this.isUploading = true;

		try {
			if (file.type.startsWith("image")) {
				document.execCommand("insertText", false, `![Uploading image](...)`)
			} else {
				document.execCommand("insertText", false, `![Uploading video](...)`)
			}
			const uploadedUrl = await this.blogService.uploadFile(file).toPromise();


			if (uploadedUrl) {
				let description = this.formBlog.value?.description
				if (file.type.startsWith('image/')) {
					if (description
						.includes("![Uploading image](...)")) {
						this.formBlog.patchValue({
							description: description.replace("![Uploading image](...)", this.MarkdownImage(uploadedUrl.url))
						})
					} else {
						this.insertMarkdownImage(uploadedUrl.url)
					}
				} else if (file.type.startsWith('video/')) {
					if (description.includes("![Uploading video](...)")) {
						this.formBlog.patchValue({
							description: description.replace("![Uploading video](...)", this.MarkdownVideo(uploadedUrl.url))
						})
					} else {
						this.insertMarkdownVideo(uploadedUrl.url)
					}
				}
			}
		} catch (error) {
			console.error('Upload failed:', error);
		} finally {
			this.isUploading = false;
			this.snackBar.open('upploading faild', "Close", {
				duration: 2000,
			});
		}
	}

	toolBarClick(textarea: HTMLTextAreaElement, start: string, end: string) {
		textarea.focus()
		document.execCommand('insertText', false, `${start}${window.getSelection()?.toString()}${end}`);
		this.formBlog.get('description')?.setValue(textarea.value);
	}

	async onImageUpload(event: Event, textarea: HTMLTextAreaElement) {
		let files = (event.target as HTMLInputElement).files
		if (files) {
			for (const file of files) {
				textarea.focus()
				await this.handleFileUpload(file);
			}
		}
	}


	getExtension(filename: string): string {
		return filename.split('.').pop()?.toLowerCase() || '';
	}

	isImage(filename: string): boolean {
		return imageExtensions.has(this.getExtension(filename));
	}

	isVideo(filename: string): boolean {
		return videoExtensions.has(this.getExtension(filename));
	}

	insertMarkdownImage(url: string): void {
		const markdown = `![image](${url})`;
		this.insertText(markdown);
	}

	insertMarkdownVideo(url: string): void {
		const markdown = `<video controls><source src="${url}" ></video>`;
		this.insertText(markdown);
	}

	MarkdownVideo(url: string): string {
		return `<video controls><source src="${url}" ></video>`;
	}

	MarkdownImage(url: string): string {
		return `![image](${url})`;
	}

	insertText(pastedText: string) {
		document.execCommand('insertText', false, pastedText);
	}

}

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg']);
const videoExtensions = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']);
