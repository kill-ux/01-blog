import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-blog-home',
    imports: [RouterOutlet],
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
