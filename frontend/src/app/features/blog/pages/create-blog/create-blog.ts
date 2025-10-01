import { Component, VERSION } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';

import { MarkdownComponent } from 'ngx-markdown'

@Component({
  selector: 'app-create-blog',
  imports: [FormsModule, MarkdownComponent],
  templateUrl: './create-blog.html',
  styleUrl: './create-blog.css'
})
export class CreateBlog {
  markdown = ``;
  formBlog: FormGroup
}
