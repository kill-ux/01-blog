import { Component, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { MatTabsModule, MatTabGroup, MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-api';
import { environment } from '../../../../environments/environment';
import { User } from '../../auth/models/model';
import { UserService } from '../../user/services/user-service';
import { MatTableModule } from '@angular/material/table';
import { MatMenu, MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../services/admin-service';
import { Blogs } from "../../blog/pages/blogs/blogs";
import { Report } from '../../blog/model/model';

@Component({
	selector: 'app-dashboard',
	imports: [MatTabGroup, MatTab, MatTableModule, MatButtonModule, MatMenuModule, MatIcon, Blogs],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
	users = signal<User[]>([])
	reports = signal<Report[]>([])
	cursorUser = 0
	cursorReport = 0
	apiUrl = environment.API_URL
	authService = inject(AuthService)
	router = inject(Router)
	userService = inject(UserService)
	admineUser = inject(AdminService)
	displayedColumns: string[] = ['position', 'nickname', 'email', 'statue', 'actions'];
	displayedColumnsReports: string[] = ['position'];

	private isLoading = false;

	ngOnInit(): void {
		if (this.cursorUser == 0) {
			this.getUsers()
		}
	}

	getReports() {
		if (this.isLoading) return;
		this.isLoading = true;
		console.log("cursorReportdfdsfsdf")
		this.userService.getReports(this.cursorReport).subscribe({
			next: reports => {
				if (reports.length > 0) {
					this.cursorReport = reports[reports.length - 1].id
					this.reports.update(rs => [...rs, ...reports])
					console.log("cursorReport => ", this.reports())
				} else {
					this.cursorReport = 0
				}
				this.isLoading = false
			},
			error: err => {
				console.log(err);
				this.isLoading = false
			}
		})
	}

	getUsers() {
		if (this.isLoading) return;
		this.isLoading = true;
		this.userService.getUsers(this.cursorUser).subscribe({
			next: users => {
				if (users.length > 0) {
					this.cursorUser = users[users.length - 1].id
					this.users.update(us => [...us, ...users])
					console.log(this.users())
				} else {
					this.cursorUser = 0
				}
				this.isLoading = false
			},
			error: err => {
				console.log(err);
				this.isLoading = false
			}
		})
	}

	isCurrentlyBanned(bannedUntil: string | null) {
		if (!bannedUntil) {
			return false;
		}

		const now = new Date()
		const bandDate = new Date(bannedUntil)

		return now > bandDate
	}

	deleteUser(id: number) {
		this.admineUser.deleteUser(id).subscribe({
			next: data => {
				this.users.update(users => {
					return users.filter(user => user.id != id)
				})
				console.log(data)
			},
			error: err => {
				console.log(err)
			}
		})
	}

	openUser(id: number) {
		console.log(id)
		this.router.navigate(["profile", id])
	}

	banUser(id: number) {
		this.admineUser.banUser(id).subscribe({
			next: data => {
				this.users.update(users => {
					const user = users.find(user => user.id == id)
					if (user) {
						user.bannedUntil = !user.bannedUntil;
					}
					return users
				})
				console.log(data)
			},
			error: err => {
				console.log(err)
			}
		})
	}

	loadMoreBlogs() {
		if (!this.isLoading) {
			console.log("hiiiiiiiiiiiii")
			if (!this.isLoading && this.cursorUser != 0) {
				this.getUsers()
			}
		}
	}

	onTabChange(event: MatTabChangeEvent) {
		// Check if the label of the selected tab is 'Reports'
		if (event.tab.textLabel === 'Reports') {
			this.getReports();
		}
	}

}
