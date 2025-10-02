import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { BlogResponce } from '../../model/model';

@Component({
	selector: 'app-blogs',
	imports: [],
	templateUrl: './blogs.html',
	styleUrl: './blogs.css'
})
export class Blogs implements OnInit {
	// private 
	public blogs: BlogResponce[];
	constructor(private blogService: BlogService) {
		this.blogs = [];
	}

	ngOnInit(): void {
		console.log("feeds")
		this.loadBlogs()
	}

	loadBlogs() {
		this.blogService.getBlogsNetworks().subscribe({
			next: (res) => {
				console.log(res)
				this.blogs = res;
				console.log(this.blogs)
			},
			error: (err) => {
				console.log(err)
			}
		})
	}
}
