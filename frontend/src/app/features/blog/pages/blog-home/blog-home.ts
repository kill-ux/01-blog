import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-blog-home',
    imports: [],
    templateUrl: './blog-home.html',
    styleUrl: './blog-home.css'
})
export class BlogHome implements OnInit {
    // private 
    constructor(){}

    ngOnInit(): void {
        this.loadBlogs()
    }

    loadBlogs() {

    }
}
