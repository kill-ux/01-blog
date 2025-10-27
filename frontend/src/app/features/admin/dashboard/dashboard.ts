import { Component, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { MatTabsModule, MatTabGroup, MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth-api';
import { environment } from '../../../../environments/environment';
import { MostReport, User } from '../../auth/models/model';
import { UserService } from '../../user/services/user-service';
import { MatTableModule } from '@angular/material/table';
import { MatMenu, MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../services/admin-service';
import { Blogs } from "../../blog/pages/blogs/blogs";
import { Report } from '../../blog/model/model';
import { TimeAgoPipe } from '../../../pipe/time-ago-pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../layouts/confirm-dialog/confirm-dialog';

@Component({
	selector: 'app-dashboard',
	imports: [MatTabGroup, MatTab, MatTableModule, MatButtonModule, MatMenuModule, MatIcon, Blogs, TimeAgoPipe],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
	users = signal<User[]>([])
	reports = signal<Report[]>([])
	countPosts = signal(0)
	mostReport = signal<MostReport[]>([])
	cursorUser = 0
	cursorReport = 0
	apiUrl = environment.API_URL
	authService = inject(AuthService)
	router = inject(Router)
	userService = inject(UserService)
	admineService = inject(AdminService)
	displayedColumns: string[] = ['id', 'nickname', 'email', 'statue', 'actions'];
	displayedColumnsReports: string[] = ['id', 'type', 'createdAt', 'reason', 'status', 'reportingUser', 'reportedUser', 'actions'];

	private isLoading = false;

	constructor(public dialog: MatDialog) {

	}

	ngOnInit(): void {
		if (this.cursorUser == 0) {
			this.getUsers()
			this.getNumberOfPosts()
			this.getMostReportedUsers()
		}
	}

	getReports() {
		if (this.isLoading) return;
		this.isLoading = true;
		this.userService.getReports(this.cursorReport).subscribe({
			next: reports => {
				if (reports.length > 0) {
					this.cursorReport = reports[reports.length - 1].id
					this.reports.update(rs => [...rs, ...reports])
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
				} else {
					this.cursorUser = 0
				}
				this.isLoading = false
			},
			error: err => {
				this.isLoading = false
			}
		})
	}

	getNumberOfPosts() {
		this.userService.getNumberOfPosts().subscribe({
			next: c => {
				this.countPosts.set(c.count)
			},
			error: err => {
				console.log(err);
				this.isLoading = false
			}
		})
	}

	getMostReportedUsers() {
		console.log("hh")
		this.userService.getMostReportedUsers().subscribe({
			next: mostReport => {
				console.log(mostReport)
				this.mostReport.set(mostReport)
			},
			error: err => {
				console.log(err);
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
		this.openConfirmDialog(() => {
			this.admineService.deleteUser(id).subscribe({
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
		});
	}

	openUser(id: number) {
		this.router.navigate(["profile", id])
	}

	openBlog(id: number) {
		this.router.navigate(["blog", id])
	}

	banUser(id: number, userR?: User) {
		this.openConfirmDialog(() => {
			this.admineService.banUser(id).subscribe({
				next: data => {
					this.users.update(users => {
						const user = users.find(user => user.id == id)
						if (user) {
							user.bannedUntil = !user.bannedUntil;
							if (userR) {
								userR.bannedUntil = user.bannedUntil;
							}
						}
						return users
					})
					console.log(data)
				},
				error: err => {
					console.log(err)
				}
			})
		});
	}

	loadMoreUsers() {
		if (!this.isLoading && this.cursorUser != 0) {
			this.getUsers()
		}
	}

	loadMoreReports() {
		if (!this.isLoading && this.cursorReport != 0) {
			this.getReports()
		}
	}

	onTabChange(event: MatTabChangeEvent) {
		if (event.tab.textLabel === 'Reports' && this.cursorReport == 0) {
			this.getReports();
		}
	}

	reviewReport(id: number) {
		this.openConfirmDialog(() => {
			this.admineService.reviewReport(id).subscribe({
				next: data => {
					this.reports.update(reports => {
						const report = reports.find(report => report.id == id)
						if (report) {
							report.status = !report.status;
						}
						return reports
					})
				},
				error: err => {
					console.log(err)
				}
			})
		})
	}

	openConfirmDialog(callback: (() => void)): void {
		const dialogRef = this.dialog.open(ConfirmDialog);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				callback()
			}
		});
	}

	adminify(id: number, userR?: User) {
		this.openConfirmDialog(() => {
			this.admineService.adminify(id).subscribe({
				next: data => {
					this.users.update(users => {
						const user = users.find(user => user.id == id)
						if (user) {
							user.role = data;
							if (userR) {
								userR.role = user.role
							}
						}
						return users
					})
					console.log(data)
				},
				error: err => {
					console.log(err)
				}
			})
		})
	}
}
