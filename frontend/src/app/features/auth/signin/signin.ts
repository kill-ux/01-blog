import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth-api';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ThemeToggle } from "../../../Theme/theme-toggle/theme-toggle";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-signin',
	imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatCardModule, MatIcon, ThemeToggle],
	templateUrl: './signin.html',
	styleUrl: './signin.css'
})
export class Signin {
	myForm: FormGroup;
	hidePassword = true;
	isLoading = false;
	snackBar = inject(MatSnackBar)

	constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
		this.myForm = this.fb.group({
			nickname: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(20),
				Validators.pattern(/^[a-zA-Z0-9_-]+$/)
			]],
			password: ['', Validators.required]
		})
	}

	onSubmit() {
		if (this.myForm.valid) {
			this.isLoading = true;
			this.authService.signin(this.myForm.value).subscribe({
				next: (res) => {
					this.router.navigate(["/"])
					this.isLoading = false;
				},
				error: (err) => {
					 const message = err.error.error ? err.error.error : "Login faild"
					// if (err.status == 423) {
					// 	message += ` ${err.error.error}`
					// }
					this.snackBar.open(message, "Close", {
						duration: 2000,
					});
					this.isLoading = false;
				}

			})
		}
	}


	get nickname() {
		return this.myForm.get("nickname")
	}

	get password() {
		return this.myForm.get("password")
	}

	togglePasswordVisibility(): void {
		this.hidePassword = !this.hidePassword;
	}

}
