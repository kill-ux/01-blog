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

	constructor(private fb: FormBuilder, private blogService: BlogService) {
		console.log(this.pasteMarkdown())
		this.formBlog = this.fb.group({
			description: ['', Validators.required],
			title: ['',Validators.required]
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

	ngOnDestroy(): void {
		this.editor?.destroy();
	}

	pasteMarkdown() {
		const markdownText = `## Hello World\nThis is **bold** text.`;
		console.log(marked.parse(markdownText))
	}


	onPaste(event: ClipboardEvent) {
		// const clipboardData = event.clipboardData;
		// const pastedText = clipboardData?.getData('text/plain');

		// if (pastedText) {
		// 	event.preventDefault();

		// 	// Now marked.parse() returns string directly (not Promise)
		// 	console.log(pa)
		// 	const html = marked.parse(pastedText) as string;
		// 	console.log('Converted HTML:', html);

		// // 	// this.insertHtmlAtCursor(html);
		// }
	}

}