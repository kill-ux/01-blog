import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { ActivatedRoute } from '@angular/router';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
	selector: 'app-single-blog',
	imports: [DatePipe, MarkdownComponent],
	templateUrl: './single-blog.html',
	styleUrl: './single-blog.css'
})
export class SingleBlog implements OnInit {
	public blog: BlogResponce | null = null;

	constructor(private blogService: BlogService, private route: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.getBlog()
	}

	getBlog() {
		const id = this.route.snapshot.paramMap.get("id");
		this.blogService.getBlog(id).subscribe({
			next: (res) => {
				console.log("res", res)
				this.blog = res
			},
			error: (err) => {
				console.log(err)
			}
		})
	}
}
