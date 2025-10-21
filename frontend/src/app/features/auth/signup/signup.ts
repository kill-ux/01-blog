import { Component, inject } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth-api';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ThemeToggle } from "../../../Theme/theme-toggle/theme-toggle";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-signup',
	imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatCardModule, MatIcon, ThemeToggle],
	templateUrl: './signup.html',
	styleUrl: './signup.css'
})
export class Signup {
	myForm: FormGroup;
	hidePassword = true;
	isLoading = false;
	snackBar = inject(MatSnackBar)

	constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
		this.myForm = this.fb.group({
			nickname: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		})
	}

	onSubmit() {
		if (this.myForm.valid) {
			this.isLoading = true;
			console.log('Form data:', this.myForm.value);
			this.authService.signup(this.myForm.value).subscribe({
				next: (res) => {
					this.isLoading = false;
					console.log('Signup successful', res.user)
					this.router.navigate(["/auth/signin"])
				},
				error: (err) => {
					this.isLoading = false
					console.log('Signup faild', err)
					this.snackBar.open('Login faild', "Close", {
						duration: 2000,
					});
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

	get email() {
		return this.myForm.get("email")
	}

	togglePasswordVisibility(): void {
		this.hidePassword = !this.hidePassword;
	}
}
