import { Component, OnDestroy, OnInit, VERSION } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor'

import { MarkdownComponent } from 'ngx-markdown'
import { MatInput } from "@angular/material/input";
import { BlogService } from '../../services/blog-service';

@Component({
	selector: 'app-create-blog',
	imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, NgxEditorComponent, NgxEditorMenuComponent],
	templateUrl: './create-blog.html',
	styleUrl: './create-blog.css'
})
export class CreateBlog implements OnInit, OnDestroy {
	markdown = ``;
	formBlog: FormGroup;

	constructor(private fb: FormBuilder, private blogService: BlogService) {
		this.formBlog = this.fb.group({
			description: ['', Validators.required]
		})
	}

	onSubmit() {
		let str = this.formBlog.value.description
		this.formBlog.setValue({ description: str.replaceAll(/<[^>]*>*<\/[^>]*>/g, "") });
		this.formBlog.setValue({ description: str.replaceAll(/<[^>]*>*<\/[^>]*>/g, "") });
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
}
