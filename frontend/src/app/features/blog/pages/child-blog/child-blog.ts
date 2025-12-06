import { Component, inject, Input, OnInit, output } from '@angular/core';
import { BlogResponce } from '../../model/model';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../services/blog-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth-api';
import { environment } from '../../../../../environments/environment';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { dataReport } from '../single-blog/single-blog';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialog } from '../../../../layouts/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';

/**
 * Component for displaying and interacting with a child blog post (comment or reply).
 * Supports liking, replying, editing, deleting, and reporting child blogs.
 */
@Component({
    selector: 'app-child-blog',
    imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatMenuModule, MatIcon, MatFormField, MatLabel, MatInputModule],
    templateUrl: './child-blog.html',
    styleUrl: './child-blog.css'
})
export class ChildBlog implements OnInit {
    formCommend: FormGroup
    @Input() child: BlogResponce | null = null;
    @Input() thread: number | null = null


    emitReport = output<dataReport>()
    deleteChild = output<number>()

    apiUrl = environment.API_URL

    hidden = false
    reply = false
    edit = false
    isLoading = false
    lastChild = 0;

    public authService = inject(AuthService)

    /**
     * Constructs the ChildBlog component.
     * Initializes the comment form with validation rules.
     * @param blogService Service for handling blog-related API calls.
     * @param fb FormBuilder for creating the form group.
     * @param router Router for navigation.
     * @param dialog MatDialog for opening confirmation dialogs.
     */
    constructor(private blogService: BlogService, private fb: FormBuilder, private router: Router, public dialog: MatDialog) {
        this.formCommend = fb.group({
            description: ['', Validators.required],
            parent: [0]
        })
    }

    /**
     * Initializes the component.
     */
    ngOnInit(): void {
        if (this.child) {
            this.child.children = []
        }
    }

    /**
     * Toggles the like status of a child blog post.
     * @param blogResponce The child blog post to like/unlike.
     */
    toggleLike(blogResponce: BlogResponce) {
        this.blogService.toggleLike(blogResponce).subscribe({
            next: res => {
                blogResponce.like = res.like == 1
                blogResponce.likes += res.like;
            },
            error: err => {
                console.log(err)
            }
        })
    }

    /**
     * Deletes a child blog post from the current list of children.
     * @param id The ID of the child blog post to delete.
     */
    DeleteChildFrom(id: number) {
        console.log("hello")
        if (this.child) {
            this.child.children = this.child.children.filter(ch => ch.id != id)
            this.child.childrenCount--
        }
    }

    /**
     * Submits a comment or updates an existing child blog.
     * @param id Optional: The ID of the parent blog for a new comment.
     */
    submitComment(id?: number) {
        this.formCommend.markAllAsTouched();
        if (this.formCommend.valid) {
            if (this.isLoading) return
            this.isLoading = true
            let comment: any = { description: this.formCommend.value.description, parent: id }
            let obs;
            if (this.edit && this.child) {
                obs = this.blogService.updateBlog(comment, this.child.id.toString())
            } else {
                obs = this.blogService.saveBlog(comment)
            }
            obs.subscribe({
                next: (res) => {
                    if (this.edit) {
                        this.child = res
                        this.child.children = []
                        this.edit = false
                    } else if (this.child) {
                        this.child.children = [res, ...this.child.children]
                        this.child.childrenCount++
                    }
                    this.formCommend.reset()
                    this.isLoading = false
                },
                error: (err) => {
                    console.log(err)
                    this.isLoading = false
                }
            })
        }
    }

    /**
     * Handles keydown events on the comment input.
     * Submits the comment if Enter is pressed without Shift.
     * @param e KeyboardEvent.
     * @param btn The submit button element.
     */
    onKeyDown(e: KeyboardEvent, btn: HTMLButtonElement) {
        if (!e.shiftKey && e.key == "Enter") {
            btn.click()
        }
    }

    /**
     * Updates the children count of the current child blog.
     * @param p An object containing the new children count.
     */
    updateParent(p: { childrenCount: number }) {
        if (this.child) {
            this.child.childrenCount = p.childrenCount
        }
    }

    /**
     * Toggles the visibility of replies or loads initial replies if none are loaded.
     * @param toggle Optional: Forces the reply section to be shown.
     */
    showReply(toggle?: boolean) {
        if (this.child?.children.length == 0) {
            this.hidden = true
            this.getBlogChildren(0)
        } else if (toggle == undefined) {
            this.hidden = !this.hidden
            if (this.hidden == false) {
                this.reply = false
            }
        } else {
            this.hidden = true
        }
    }

    /**
     * Toggles the reply input form visibility.
     */
    toggelReply() {
        this.hidden = !this.hidden
    }

    /**
     * Loads children (replies) for the current blog post.
     * Supports pagination.
     * @param cursor The ID of the last child loaded, used for pagination.
     */
    getBlogChildren(cursor: number) {
        if (this.child) {
            if (this.isLoading) return;
            this.isLoading = true;
            this.blogService.getBlogChildren(this.child.id, cursor).subscribe({
                next: (res) => {
                    if (this.child && res.children.length > 0) {
                        res.children = res.children.map(child => {
                            if (child) {
                                child.parent = this.child
                            }
                            return child
                        })
                        this.child.children = [...this.child.children, ...res.children]
                        this.lastChild = res.children[res.children.length - 1].id
                    } else {
                        this.lastChild = 0;
                    }
                    this.isLoading = false;
                },
                error: (err) => {
                    console.log(err)
                    this.isLoading = false;
                }
            })
        }

    }

    /**
     * Deletes the current child blog post after user confirmation.
     * Emits an event to the parent component upon successful deletion.
     * @param id The ID of the child blog post to delete.
     */
    DeleteBlog(id: number) {
        this.openConfirmDialog(() => {
            this.blogService.DeleteBlog(id).subscribe({
                next: res => {
                    if (this.child) {
                        this.deleteChild.emit(this.child?.id)
                        this.child = null;
                    }
                },
                error: err => {
                    console.log(err)
                }
            })
        })
    }

    /**
     * Enables editing mode for the current child blog and populates the form.
     * @param id The ID of the child blog to edit.
     */
    EditBlog(id: number) {
        this.edit = true
        this.formCommend.patchValue({ description: this.child?.description })
    }

    /**
     * Toggles the reply input form visibility.
     */
    changeReply() {
        this.reply = !this.reply
    }


    /**
     * Loads more children (replies) for the current blog post.
     * Only loads if not already loading and there are more children to load.
     */
    loadMoreChildren() {
        if (this.lastChild != 0 && !this.isLoading) {
            this.getBlogChildren(this.lastChild);
        }
    }

    /**
     * Navigates to the detailed view of a blog post.
     * @param id The ID of the blog post to view.
     */
    openBlog(id: number) {
        this.router.navigate(["blog", id])
    }

    /**
     * Emits a report event to the parent component.
     * @param data The data related to the report.
     */
    ReportBlog(data: dataReport) {
        this.emitReport.emit(data)
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
