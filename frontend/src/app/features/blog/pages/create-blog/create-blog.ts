import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';

import { BlogService } from '../../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

/**
 * Component for creating and editing blog posts.
 * Provides a form for title and description, supports markdown, and handles image/video uploads.
 */
@Component({
    selector: 'app-create-blog',
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MarkdownModule, MatIcon],
    templateUrl: './create-blog.html',
    styleUrl: './create-blog.css'
})
export class CreateBlog implements OnInit, OnDestroy {
    formBlog: FormGroup;
    isUploading = false;
    isSaving = false;
    id: string | null = null
    snackBar = inject(MatSnackBar)
    display = signal(false)

    private pendingFiles = new Map<string, File>();

    /**
     * Constructs the CreateBlog component.
     * Initializes the blog form and injects necessary services.
     * @param fb FormBuilder for creating the form group.
     * @param blogService Service for blog-related API calls.
     * @param route ActivatedRoute for accessing route parameters.
     * @param router Router for navigation.
     */
    constructor(private fb: FormBuilder, private blogService: BlogService, private route: ActivatedRoute, private router: Router) {
        this.formBlog = this.fb.group({
            description: ['', Validators.required],
            title: ['', Validators.required]
        })
    }

    /**
     * Initializes the component. Checks for an 'id' in the route to determine if it's an edit operation.
     */
    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get("id")
        if (this.id) {
            this.getBlog(this.id)
        }
    }

    /**
     * Cleans up blob URLs when the component is destroyed to prevent memory leaks.
     */
    ngOnDestroy(): void {
        for (const url of this.pendingFiles.keys()) {
            URL.revokeObjectURL(url);
        }
    }

    /**
     * Fetches an existing blog post for editing.
     * @param id The ID of the blog post to fetch.
     */
    getBlog(id: string) {
        this.blogService.getBlog(id).subscribe({
            next: (res) => {
                this.formBlog.setValue({
                    description: res.description,
                    title: res.title
                })
            },
            error: (err) => {
                if (err.status == 400) {
                    this.router.navigate(["blog-not-found"])
                }
                console.log(err)
            }
        })
    }

    /**
     * Handles file selection, creating a local URL for preview and storing the file for later upload.
     * @param file The selected file (image or video).
     */
    private handleFileSelection(file: File): void {
        if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))) {
            this.snackBar.open("invalid file", "Close", { duration: 2000 })
            return;
        }

        // Create a temporary local blob URL for preview
        const localUrl = URL.createObjectURL(file);
        // Store the file with its local URL
        this.pendingFiles.set(localUrl, file);

        // Insert markdown with the local blob URL for preview
        if (file.type.startsWith('image/')) {
            this.insertMarkdownImage(localUrl);
        } else if (file.type.startsWith('video/')) {
            this.insertMarkdownVideo(localUrl);
        }
    }

    /**
     * Handles the submission of the blog post form.
     * Uploads pending files, replaces local URLs with remote URLs, and then saves/updates the blog post.
     * @param mark The MarkdownComponent instance to clear its content after saving.
     */
    async onSubmit(mark: MarkdownComponent) {
        if (this.isSaving) return;

        this.formBlog.markAllAsTouched();
        if (this.formBlog.invalid) {
            return;
        }

        this.isSaving = true;

        try {
            let content = this.formBlog.value.description || '';

            // Step 1: Upload all pending files and replace local URLs with remote URLs
            if (this.pendingFiles.size > 0) {
                this.snackBar.open('When blog saved we notify you', "Close", {
                    duration: 2000,
                });
                const uploadPromises = Array.from(this.pendingFiles.entries()).filter(([localUrl, file]) => {
                    return content.includes(localUrl) && (this.isImage(file.name) || this.isVideo(file.name));
                }).map(
                    ([localUrl, file]) =>
                        firstValueFrom(this.blogService.uploadFile(file)).then(response => {
                            // Clean up the local blob URL
                            URL.revokeObjectURL(localUrl);
                            return { localUrl, remoteUrl: response?.url };
                        })
                );

                const uploadedFiles = await Promise.all(uploadPromises);

                // Replace all local URLs with remote URLs in content
                for (const { localUrl, remoteUrl } of uploadedFiles) {
                    content = content.replaceAll(localUrl, remoteUrl);
                }

                // Update form with final content containing remote URLs
                this.formBlog.patchValue({ description: content });
                this.pendingFiles.clear();
            }



            // Step 2: Save the blog post
            let obs;
            if (this.id) {
                obs = this.blogService.updateBlog(this.formBlog.value, this.id)
            } else {
                obs = this.blogService.saveBlog(this.formBlog.value)
            }

            obs.subscribe({
                next: res => {
                    this.snackBar.open(this.id ? 'Blog updated' : 'New blog created', "View Blog", {
                        duration: 6000
                    }).onAction().subscribe(() => {
                        this.router.navigate(['blog', res?.id])
                    });
                    this.formBlog.reset()
                    mark.element.nativeElement.innerHTML = ""
                    this.isSaving = false;
                },
                error: err => {
                    let message = Object.values(err.error)[0] || err.error
                    this.snackBar.open(`Save failed: ${message}`, "Close", {
                        duration: 2000,
                    });
                    this.isSaving = false;
                }
            });


        } catch (error) {
            this.snackBar.open('Save failed', "Close", {
                duration: 2000,
            });
            this.isSaving = false
        }
    }


    /**
     * Handles paste events, checking for image/video files or URLs in the clipboard.
     * @param event The ClipboardEvent.
     */
    async onPaste(event: ClipboardEvent) {
        const clipboardData = event.clipboardData;
        const pastedText = clipboardData?.getData('text/plain');

        if (pastedText) {
            try {
                const url = new URL(pastedText)
                if (this.isImage(url.pathname)) {
                    event.preventDefault()
                    this.insertMarkdownImage(pastedText);
                } else if (this.isVideo(url.pathname)) {
                    event.preventDefault()
                    this.insertMarkdownVideo(pastedText);
                }
            } catch {
                return
            }
        } else {
            if (clipboardData?.items) {
                for (const item of clipboardData.items) {
                    if (item.kind == 'file') {
                        event.preventDefault()
                        const file = item.getAsFile();
                        if (file) {
                            this.handleFileSelection(file);
                        }
                    }
                }
            }
        }
    }

    /**
     * Handles drop events for files, processing dropped image/video files.
     * @param event The DragEvent.
     */
    async onDrop(event: DragEvent) {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (files) {
            for (const file of Array.from(files)) {
                this.handleFileSelection(file);
            }
        }
    }

    /**
     * Handles image file selection from an input element.
     * @param event The Event from the file input.
     * @param textarea The HTMLTextAreaElement where markdown should be inserted.
     */
    async onImageUpload(event: Event, textarea: HTMLTextAreaElement) {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
            textarea.focus();
            for (const file of Array.from(files)) {
                this.handleFileSelection(file);
            }
        }
    }

    /**
     * Inserts markdown formatting around the selected text in a textarea.
     * @param textarea The HTMLTextAreaElement to modify.
     * @param start The markdown string to insert before the selected text.
     * @param end The markdown string to insert after the selected text.
     */
    toolBarClick(textarea: HTMLTextAreaElement, start: string, end: string) {
        textarea.focus()
        document.execCommand('insertText', false, `${start}${window.getSelection()?.toString()}${end}`);
        this.formBlog.get('description')?.setValue(textarea.value);
    }

    /**
     * Extracts the file extension from a filename.
     * @param filename The name of the file.
     * @returns The file extension in lowercase, or an empty string if no extension.
     */
    getExtension(filename: string): string {
        return filename.split('.').pop()?.toLowerCase() || '';
    }

    /**
     * Checks if a filename corresponds to an image file based on its extension.
     * @param filename The name of the file.
     * @returns True if the file is an image, false otherwise.
     */
    isImage(filename: string): boolean {
        return imageExtensions.has(this.getExtension(filename));
    }

    /**
     * Checks if a filename corresponds to a video file based on its extension.
     * @param filename The name of the file.
     * @returns True if the file is a video, false otherwise.
     */
    isVideo(filename: string): boolean {
        return videoExtensions.has(this.getExtension(filename));
    }

    /**
     * Inserts markdown for an image into the textarea.
     * @param url The URL of the image.
     */
    insertMarkdownImage(url: string): void {
        const markdown = `![image](${url})`;
        this.insertText(markdown);
    }

    /**
     * Inserts markdown for a video into the textarea.
     * @param url The URL of the video.
     */
    insertMarkdownVideo(url: string): void {
        const markdown = `<video controls><source src="${url}" ></video>`;
        this.insertText(markdown);
    }

    /**
     * Generates HTML for a video tag.
     * @param url The URL of the video.
     * @returns The HTML string for the video tag.
     */
    MarkdownVideo(url: string): string {
        return `<video controls><source src="${url}" ></video>`;
    }

    /**
     * Generates markdown for an image.
     * @param url The URL of the image.
     * @returns The markdown string for the image.
     */
    MarkdownImage(url: string): string {
        return `![image](${url})`;
    }

    /**
     * Inserts text at the current cursor position in the active editable element.
     * @param pastedText The text to insert.
     */
    insertText(pastedText: string) {
        document.execCommand('insertText', false, pastedText);
    }

    /**
     * Toggles the display of the preview section.
     */
    HidePrevew() {
        this.display.update(old => !old)
    }
}

const imageExtensions = new Set(["jpg", "jpeg", "png", "gif"]);
const videoExtensions = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']);
