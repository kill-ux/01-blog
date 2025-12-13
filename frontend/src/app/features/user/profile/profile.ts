import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../../auth/models/model';
import { AuthService } from '../../auth/services/auth-api';
import { ActivatedRoute, Router } from '@angular/router';
import { Blogs } from "../../blog/pages/blogs/blogs";
import { DatePipe } from '@angular/common';
import { Discover } from "../discover/discover";
import { environment } from '../../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogService } from '../../blog/services/blog-service';
import { AdminService } from '../../admin/services/admin-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../layouts/confirm-dialog/confirm-dialog';

/**
 * Component for displaying and managing user profiles.
 * Allows viewing user information, blogs, subscribers, subscriptions, and performing actions like subscribing, reporting, and uploading avatars.
 */
@Component({
    selector: 'app-profile',
    imports: [Blogs, DatePipe, Discover, DatePipe, MatProgressSpinnerModule, MatButtonModule, MatMenuModule, MatIcon, FormsModule, MatFormFieldModule, MatInputModule],
    templateUrl: './profile.html',
    styleUrl: './profile.css'
})
export class Profile implements OnInit {
    userProfile = signal<User | null>(null);
    subscribers = signal<User[]>([]);
    subscribtions = signal<User[]>([]);
    userService = inject(UserService);
    isLoading = false
    currentComponent = signal("blogs")
    public authService = inject(AuthService)
    public blogService = inject(BlogService)
    admineService = inject(AdminService)
    snackBar = inject(MatSnackBar)
    router = inject(ActivatedRoute)
    route = inject(Router)
    dialog = inject(MatDialog)
    apiUrl = environment.API_URL;

    /**
     * Initializes the component. Retrieves the user ID from the route parameters and loads the user's profile.
     */
    ngOnInit() {
        this.router.params.subscribe(params => {
            const id = Number(params["id"]);
            if (Number.isNaN(id)) {
                this.route.navigate(["user-not-found"])
                return
            }
            this.currentComponent.set("blogs")
            this.loadProfile(id);
        })
    }

    /**
     * Loads the user profile based on the provided user ID.
     * @param id The ID of the user whose profile is to be loaded.
     */
    loadProfile(id: number) {
        this.userService.getUserById(id).subscribe({
            next: (profile) => {
                this.userProfile.set(profile.user);
            },
            error: (error) => {
                this.snackBar.open('user not found', "Close", {
                    duration: 2000,
                });
            }
        });
    }

    /**
     * Subscribes to or unsubscribes from a user.
     * @param id The ID of the user to subscribe to/unsubscribe from.
     */
    subscribe(id: any) {
        if (this.isLoading) return
        this.isLoading = true
        this.userService.subscribe(id).subscribe({
            next: res => {
                this.userProfile.update(user => {
                    if (user && user.id == id) {
                        user.sub = res.operation == "subscribed" ? true : false
                        user.subscribers += user.sub ? 1 : -1
                    }
                    return user
                })
                this.snackBar.open(`Operation succeced: ${res.operation}`, "Close", {
                    duration: 2000,
                });
                this.isLoading = false


            },
            error: err => {
                console.log(err)
                this.snackBar.open(`Faild Operation: Subscribe`, "Close", {
                    duration: 2000,
                });
                this.isLoading = false
            }
        })
    }

    /**
     * Sets the current component to display subscribers.
     */
    getSubscribers() {
        if (this.currentComponent() != "subscribers") {
            this.currentComponent.set("subscribers")
        }
    }

    /**
     * Sets the current component to display subscriptions.
     */
    getSubscribtions() {
        if (this.currentComponent() != "subscribtions") {
            this.currentComponent.set("subscribtions")
        }
    }

    /**
     * Updates the number of subscriptions for the current user profile.
     * @param num The number to add or subtract from the current subscriptions count.
     */
    setSubscribtions(num: number) {
        console.log("setSubscribtions called with", num)
        let currentUser = this.userProfile();
        if (currentUser)
            currentUser.subscribtions += num
    }

    /**
     * Updates the number of subscribers for the current user profile.
     * @param num The number to add or subtract from the current subscribers count.
     */
    setSubscribers(num: number) {
        let currentUser = this.userProfile();
        if (currentUser)
            currentUser.subscribers += num
    }

    /**
     * Sets the current component to display blog posts.
     */
    seeBlogs() {
        this.currentComponent.set("blogs")
    }

    /**
     * Handles the upload of a new profile image (avatar).
     * @param event The DOM event triggered by the file input change.
     */
    uploadImage(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const selectedFile = input.files[0]
            if (selectedFile.type.startsWith('image/')) {
                this.userService.updateProfile(selectedFile).subscribe({
                    next: res => {
                        if (this.authService.currentUser) {
                            this.authService.currentUser.avatar = res.url + `?time=${Date.now()}`
                            this.userProfile.update(user => {
                                if (user) {
                                    user.avatar = res.url + `?time=${Date.now()}`
                                }
                                return user
                            })
                        }
                        this.snackBar.open(`Operation succeced: Upload Image`, "Close", {
                            duration: 2000,
                        });
                    },
                    error: err => {
                        console.log(err)
                        this.snackBar.open(`Faild Operation: Uploads`, "Close", {
                            duration: 2000,
                        });
                    }
                })
            } else {
                this.snackBar.open(`Faild Operation: Uploads`, "Close", {
                    duration: 2000,
                });
            }
        }
    }

    /**
     * Reports a user.
     * @param id The ID of the user to report.
     * @param reason The reason for reporting the user.
     * @param menuTrigger The MatMenuTrigger associated with the report action.
     */
    ReportUser(id: number | undefined, reason: string, menuTrigger: MatMenuTrigger) {
        this.openConfirmDialog(() => {
            reason = reason.trim();
            if (reason.length == 0 || !id) return
            this.blogService.Report({ userId: id, reason }).subscribe({
                next: res => {
                    this.snackBar.open(`Operation succeced: Report`, "Close", {
                        duration: 2000,
                    });
                },
                error: err => {
                    console.log(err)
                    this.snackBar.open(`Faild Operation: Report`, "Close", {
                        duration: 2000,
                    });
                }
            })
            menuTrigger.closeMenu()
        })
    }

    /**
         * Opens a confirmation dialog and executes a callback function if confirmed.
         * @param callback The function to execute upon confirmation.
         */
    openConfirmDialog(callback: (() => void)): void {
        const dialogRef = this.dialog.open(ConfirmDialog);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                callback()
            }
        });
    }
}
