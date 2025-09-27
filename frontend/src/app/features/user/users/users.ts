import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';

@Component({
    selector: 'app-users',
    imports: [],
    templateUrl: './users.html',
    styleUrl: './users.css'
})
export class Users implements OnInit {
    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.loadUsers()
    }

    loadUsers() {
        this.userService.getUsers().subscribe({
            next: (res) => {
                console.log(res)
            },
            error: (err) => console.log(err)
        })
    }
}
