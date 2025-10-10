import { Component, Input } from '@angular/core';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../services/blog-service';

@Component({
	selector: 'app-child-blog',
	imports: [DatePipe],
	templateUrl: './child-blog.html',
	styleUrl: './child-blog.css'
})
export class ChildBlog {
	@Input() child: BlogResponce | null = null;
	isLoading = false

	constructor(private blogService: BlogService) {

	}

	toggleLike(blogResponce: BlogResponce) {
		// this.blogService.toggleLike(blogResponce).subscribe({
		// 	next: res => {
		// 		console.log(res)
		// 		blogResponce.like = res.like == 1
		// 		blogResponce.likes += res.like;
		// 	},
		// 	error: err => {
		// 		console.log(err)
		// 	}
		// })
	}

	moreReply(id: number) {

	}

	getBlogChildren(cursor: number) {
		// if (this.isLoading) return;
		// this.isLoading = true;
		// this.blogService.getBlogChildren(id, cursor).subscribe({
		// 	next: (res) => {
		// 		if (this.blog && res.children.length > 0) {
		// 			this.blog.children = [...this.blog.children, ...res.children]
		// 			this.lastChild = res.children[res.children.length - 1].id
		// 		} else {
		// 			this.lastChild = 0;
		// 		}
		// 		this.isLoading = false;
		// 	},
		// 	error: (err) => {
		// 		console.log(err)
		// 		this.isLoading = false;
		// 	}
		// })
	}
}
