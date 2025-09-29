import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../features/auth/models/model';

@Component({
  selector: 'app-dialog-profile',
  imports: [],
  templateUrl: './dialog-profile.html',
  styleUrl: './dialog-profile.css'
})
export class DialogProfile {
  constructor(
    public dialogRef: MatDialogRef<DialogProfile>, @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    console.log("data => ",data)
  }

  onNoClick() {
    this.dialogRef.close()
  }
}
