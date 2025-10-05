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


	onPaste(event: ClipboardEvent) {
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
						}
					}
				}
			}
		}



		// console.log(pastedText)
		// document.execCommand('insertText', false, `![image](${pastedText})`);



		// if (pastedText) {
		// 	event.preventDefault();

		// 	// Now marked.parse() returns string directly (not Promise)
		// 	console.log(pa)
		// 	const html = marked.parse(pastedText) as string;
		// 	console.log('Converted HTML:', html);

		// // 	// this.insertHtmlAtCursor(html);
		// }
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

}

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg']);
const videoExtensions = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']);