import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogService } from '../../services/blog-service';

/**
 * Component for the blog home page.
 * This component acts as a container for blog-related routes and features.
 */
@Component({
    selector: 'app-blog-home',
    imports: [RouterOutlet],
    templateUrl: './blog-home.html',
    styleUrl: './blog-home.css'
})
export class BlogHome {
    
}
