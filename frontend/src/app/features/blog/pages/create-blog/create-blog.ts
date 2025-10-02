import { Component, OnDestroy, OnInit, VERSION } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor'

import { MarkdownComponent } from 'ngx-markdown'
import { MatInput } from "@angular/material/input";

@Component({
	selector: 'app-create-blog',
	imports: [FormsModule, MarkdownComponent, ReactiveFormsModule, MatFormFieldModule, MatInput, NgxEditorComponent, NgxEditorMenuComponent],
	templateUrl: './create-blog.html',
	styleUrl: './create-blog.css'
})
export class CreateBlog implements OnInit, OnDestroy {
	markdown = ``;
	formBlog: FormGroup;
	constructor(private fb: FormBuilder) {
		this.formBlog = this.fb.group({
			html: ['', Validators.required]
		})
	}

	onSubmit() {
		if (this.formBlog.valid) {
			console.log('data', this.formBlog.value)
		}
	}
	editor: Editor = new Editor();
	html = '';
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
