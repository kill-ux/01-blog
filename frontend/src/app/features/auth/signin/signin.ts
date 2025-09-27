import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../services/auth-api';

@Component({
	selector: 'app-signin',
	imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
	templateUrl: './signin.html',
	styleUrl: './signin.css'
})
export class Signin {
	myForm: FormGroup;

	constructor(private fb: FormBuilder, private authApi: AuthApi) {
		this.myForm = this.fb.group({
			nickname: ['', Validators.required],
			password: ['', Validators.required]
		})
	}

	onSubmit() {
		if (this.myForm.valid) {
			console.log('Form data:', this.myForm.value);
			this.authApi.signin(this.myForm.value).subscribe({
				next: (res) => {
					this.authApi.setAuthToken(res.token)
					// navigate this.router.navigate(["/home"])
				},
				error: (err) => console.log('Login faild', err)

			})
		}
	}
}
