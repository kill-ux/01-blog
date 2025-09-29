import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { DialogProfile } from './dialog-profile/dialog-profile';
import { AuthService } from '../../features/auth/services/auth-api';

@Component({
	selector: 'app-navbar',
	imports: [MatDialogModule],
	templateUrl: './navbar.html',
	styleUrl: './navbar.css'
})
export class Navbar {
	private authService = inject(AuthService)
	constructor(public dialog: MatDialog) { }

	openDialog() {
		const dialogRef = this.dialog.open(DialogProfile, {
			// height: '300px', // Set height (optional)
			maxWidth: '90vw', // Limit max width (responsive)
			minWidth: '120px', // Minimum width
			position: { top: '100px', right: '50px' }, // Position dialog
			panelClass: 'custom-dialog-class', // Custom CSS class for styling
			// backdropClass: 'custom-backdrop', // Custom backdrop styling
			// disableClose: false, // Allow/disable closing on backdrop click or ESC
			// autoFocus: true, // Auto-focus first focusable element
			// data: { key: 'value' }, // Pass data to dialog component
			// hasBackdrop: true, // Show/hide backdrop
			// enterAnimationDuration: '300ms', // Animation duration for opening
			// exitAnimationDuration: '200ms', // Animation duration for closing
			data: this.authService.currentUser
		})

		dialogRef.afterClosed().subscribe((res) => {
			console.log('The dialog was closed', res);
		})
	}

}