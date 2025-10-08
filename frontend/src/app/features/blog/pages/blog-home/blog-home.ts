import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogService } from '../../services/blog-service';

@Component({
    selector: 'app-blog-home',
    imports: [RouterOutlet],
    templateUrl: './blog-home.html',
    styleUrl: './blog-home.css'
})
export class BlogHome {
    
}
