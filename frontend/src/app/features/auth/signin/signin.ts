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

/**
 * Component for user sign-in.
 * Handles user authentication, form validation, and navigation after successful login.
 */
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

	/**
	 * Constructs the Signin component.
	 * Initializes the sign-in form with validation rules.
	 * @param fb FormBuilder for creating the form group.
	 * @param authService Service for handling authentication API calls.
	 * @param router Router for navigation.
	 */
	constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
		this.myForm = this.fb.group({
			nickname: ['', [
				Validators.required,
				Validators.minLength(1),
				Validators.maxLength(20),
			]],
			password: ['', Validators.required]
		})
	}

	/**
	 * Handles form submission.
	 * Attempts to sign in the user if the form is valid.
	 * Navigates to the home page on success, displays an error message on failure.
	 */
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
					this.snackBar.open(message, "Close", {
						duration: 2000,
					});
					this.isLoading = false;
				}

			})
		}
	}

	/**
	 * Getter for the nickname form control.
	 */
	get nickname() {
		return this.myForm.get("nickname")
	}

	/**
	 * Getter for the password form control.
	 */
	get password() {
		return this.myForm.get("password")
	}

	/**
	 * Toggles the visibility of the password input field.
	 */
	togglePasswordVisibility(): void {
		this.hidePassword = !this.hidePassword;
	}

}
