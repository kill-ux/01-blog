import { Component } from '@angular/core';
import { MatDialogRef, MatDialogClose } from '@angular/material/dialog';

/**
 * Component for a generic confirmation dialog.
 * Used to ask the user for confirmation before performing a potentially destructive action.
 */
@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogClose],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
}
