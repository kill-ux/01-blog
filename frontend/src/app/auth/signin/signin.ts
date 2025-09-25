import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-signin',
	imports: [MatButtonModule, MatFormFieldModule, MatInputModule],
	templateUrl: './signin.html',
	styleUrl: './signin.css'
})
export class Signin {
	// counter = signal(0);
	// update = () => this.counter.update((prev => prev + 1))
}
