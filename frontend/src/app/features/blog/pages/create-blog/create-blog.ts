import { Component, ElementRef, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class CreateBlog implements OnInit, OnDestroy {
	formBlog: FormGroup;
	isUploading = false;
	isSaving = false;
	id: string | null = null
	snackBar = inject(MatSnackBar)

	private pendingFiles = new Map<string, File>();

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

	// Clean up blob URLs when component is destroyed
	ngOnDestroy(): void {
		for (const url of this.pendingFiles.keys()) {
			URL.revokeObjectURL(url);
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
				if (err.status == 400) {
					this.router.navigate(["blog-not-found"])
				}
				console.log(err)
			}
		})
	}

	// REVISED: Handle file selection without immediate upload
	private handleFileSelection(file: File): void {
		if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))) {
			return;
		}

		// Create a temporary local blob URL for preview
		const localUrl = URL.createObjectURL(file);
		// Store the file with its local URL
		this.pendingFiles.set(localUrl, file);

		// Insert markdown with the local blob URL for preview
		if (file.type.startsWith('image/')) {
			this.insertMarkdownImage(localUrl);
		} else if (file.type.startsWith('video/')) {
			this.insertMarkdownVideo(localUrl);
		}
	}

	async onSubmit() {
		if (this.isSaving) return;

		this.formBlog.markAllAsTouched();
		if (this.formBlog.invalid) {
			return;
		}

		this.isSaving = true;

		try {
			let content = this.formBlog.value.description || '';

			// Step 1: Upload all pending files and replace local URLs with remote URLs
			if (this.pendingFiles.size > 0) {
				const uploadPromises = Array.from(this.pendingFiles.entries()).filter(([localUrl, file]) => {
					return content.includes(localUrl) && (this.isImage(file.name) || this.isVideo(file.name));
				}).map(
					([localUrl, file]) =>
						this.blogService.uploadFile(file).toPromise().then(response => {
							// Clean up the local blob URL
							URL.revokeObjectURL(localUrl);
							return { localUrl, remoteUrl: response?.url };
						})
				);

				const uploadedFiles = await Promise.all(uploadPromises);

				// Replace all local URLs with remote URLs in content
				for (const { localUrl, remoteUrl } of uploadedFiles) {
					content = content.replaceAll(localUrl, remoteUrl);
				}

				// Update form with final content containing remote URLs
				this.formBlog.patchValue({ description: content });
				this.pendingFiles.clear();
			}

			// Step 2: Save the blog post
			let obs;
			if (this.id) {
				obs = this.blogService.updateBlog(this.formBlog.value, this.id)
			} else {
				obs = this.blogService.saveBlog(this.formBlog.value)
			}

			const res = await obs.toPromise();
			this.router.navigate(['blog', res?.id])
			this.snackBar.open(this.id ? 'Blog updated' : 'New blog created', "Close", {
				duration: 2000,
			});

		} catch (error) {
			this.snackBar.open('Save failed', "Close", {
				duration: 2000,
			});
		} finally {
			this.isSaving = false;
		}
	}

	// REVISED: Use handleFileSelection instead of immediate upload
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
				for (const item of clipboardData.items) {
					if (item.kind == 'file') {
						event.preventDefault()
						const file = item.getAsFile();
						if (file) {
							this.handleFileSelection(file);
						}
					}
				}
			}
		}
	}

	// REVISED: Use handleFileSelection instead of immediate upload
	async onDrop(event: DragEvent) {
		event.preventDefault();
		const files = event.dataTransfer?.files;
		if (files) {
			for (const file of Array.from(files)) {
				this.handleFileSelection(file);
			}
		}
	}

	// REVISED: Use handleFileSelection instead of immediate upload
	async onImageUpload(event: Event, textarea: HTMLTextAreaElement) {
		const files = (event.target as HTMLInputElement).files;
		if (files) {
			textarea.focus();
			for (const file of Array.from(files)) {
				this.handleFileSelection(file);
			}
		}
	}

	toolBarClick(textarea: HTMLTextAreaElement, start: string, end: string) {
		textarea.focus()
		document.execCommand('insertText', false, `${start}${window.getSelection()?.toString()}${end}`);
		this.formBlog.get('description')?.setValue(textarea.value);
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