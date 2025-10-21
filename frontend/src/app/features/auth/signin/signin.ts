import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth-api';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ThemeToggle } from "../../../Theme/theme-toggle/theme-toggle";

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
			console.log('Form data:', this.myForm.value);
			this.authService.signin(this.myForm.value).subscribe({
				next: (res) => {
					// this.authService.setAuthToken(res.token)
					this.router.navigate(["/"])
					this.isLoading = false;
				},
				error: (err) => {
					console.log('Login faild', err)
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
