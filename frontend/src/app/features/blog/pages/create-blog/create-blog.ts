import { Component, OnDestroy, OnInit, VERSION } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor'
// import { MarkdownService } from 'ngx-markdown';
import { marked } from 'marked';

import { LMarkdownEditorModule } from 'ngx-markdown-editor'

import { MarkdownComponent } from 'ngx-markdown'
import { MatInput } from "@angular/material/input";
import { BlogService } from '../../services/blog-service';

marked.setOptions({
	async: false,
	gfm: true,
	breaks: true
});

@Component({
	selector: 'app-create-blog',
	imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, LMarkdownEditorModule, MarkdownComponent],
	templateUrl: './create-blog.html',
	styleUrl: './create-blog.css'
})
export class CreateBlog implements OnInit, OnDestroy {
	markdown = ``;
	formBlog: FormGroup;
	previewUrl = "";
	isUploading = false;

	constructor(private fb: FormBuilder, private blogService: BlogService) {
		console.log(this.pasteMarkdown())
		this.formBlog = this.fb.group({
			description: ['', Validators.required],
			title: ['', Validators.required]
		})
	}


	editorOptions = {
		showPreviewPanel: true,
		enablePreviewContentClick: true,
		resizable: true
	};

	onSubmit() {
		this.formBlog.markAllAsTouched();

		if (this.formBlog.valid) {
			console.log('data', this.formBlog.value.description)
			this.blogService.saveBlog(this.formBlog.value).subscribe({
				next: (res) => {
					console.log("ok")
				},
				error: (err) => {
					console.log(err)
				}
			})

		}
	}
	mode = "editor"
	editor: Editor = new Editor();
	description = '';
	ngOnInit(): void {
		this.editor = new Editor();
		this.editor.commands
			.focus()
			.exec();
	}

	replaceSelectedText() {
		const selection = window.getSelection();
		if (selection && selection.toString() && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			range.deleteContents();
			range.insertNode(document.createTextNode('new text'));
		} else {
			console.log('No selection or range. rangeCount:', selection?.rangeCount, 'Selected text:', selection?.toString());
		}
	}

	ngOnDestroy(): void {
		this.editor?.destroy();
	}

	pasteMarkdown() {
		const markdownText = `## Hello World\nThis is **bold** text.`;
		console.log(marked.parse(markdownText))
	}


	async onPaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;


		const pastedText = clipboardData?.getData('text/plain');
		if (pastedText) {
			try {
				const url = new URL(pastedText)
				if (this.isImage(url.pathname)) {
					event.preventDefault()
					console.log('Image detected');
					document.execCommand('insertText', false, `![image](${pastedText})`);
				} else if (this.isVideo(url.pathname)) {
					event.preventDefault()
					console.log('Video detected');
					document.execCommand('insertText', false, `<video controls><source src="${pastedText}"></video>`);
				}
			} catch {
				console.log("hh")
				return
			}

		} else {
			if (clipboardData?.items) {
				for (const item of clipboardData?.items) {
					console.log(item)
					if (item.kind == 'file') {
						event.preventDefault()
						const file = item.getAsFile();
						console.log('Pasted file:', file);
						if (file) {
							console.log(file.type)
							let previewUrl = URL.createObjectURL(file)
							document.execCommand('insertText', false, `![image](${previewUrl})`);

							await this.handleFileUpload(file);
						}
					}
				}
			}
		}

	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		const files = event.dataTransfer?.files;
		console.log(files)
		if (files) {
			for (const file of files) {
				let previewUrl = URL.createObjectURL(file)
				document.execCommand('insertText', false, `![image](${previewUrl})`);
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


	async handleFileUpload(file: File): Promise<void> {
		// Validate file
		const validation = this.validateFile(file);
		if (!validation.isValid) {
			alert(validation.error);
			return;
		}

		this.isUploading = true;

		try {
			// Upload to backend
			const uploadedUrl = await this.blogService.uploadFile(file);

			// Insert markdown based on file type
			if (file.type.startsWith('image/')) {
				this.insertMarkdownImage(uploadedUrl);
			} else if (file.type.startsWith('video/')) {
				this.insertMarkdownVideo(uploadedUrl);
			}

		} catch (error) {
			console.error('Upload failed:', error);
			alert('File upload failed. Please try again.');
		} finally {
			this.isUploading = false;
		}
	}

	// Insert markdown image syntax
	insertMarkdownImage(url: string): void {
		const markdown = `![image](${url})`;
		this.insertText(markdown);
	}

	// Insert markdown video syntax
	insertMarkdownVideo(url: string): void {
		const markdown = `<video controls src="${url}" ></video>`;
		this.insertText(markdown);
	}

	insertText(pastedText: string) {
		document.execCommand('insertText', false, `<video controls><source src="${pastedText}"></video>`);
	}

	


	validateFile(file: File): { isValid: boolean; error?: string } {
		const maxSize = 10 * 1024 * 1024; // 10MB
		const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

		if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
			return {
				isValid: false,
				error: 'Please select only image or video files'
			};
		}

		if (file.type.startsWith('image/') && !allowedImageTypes.includes(file.type)) {
			return {
				isValid: false,
				error: 'Image type not supported. Use JPEG, PNG, GIF, or WebP.'
			};
		}

		if (file.type.startsWith('video/') && !allowedVideoTypes.includes(file.type)) {
			return {
				isValid: false,
				error: 'Video type not supported. Use MP4, WebM, or OGG.'
			};
		}

		if (file.size > maxSize) {
			return {
				isValid: false,
				error: 'File size too large. Maximum size is 10MB.'
			};
		}

		return { isValid: true };
	}

}

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg']);
const videoExtensions = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']);