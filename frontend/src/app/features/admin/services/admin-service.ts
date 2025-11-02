import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthState, User } from '../../auth/models/model';
import { BlogResponce, Notification, NotificationResponce, Report } from '../../blog/model/model';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AdminService {
	private apiUrl = environment.API_URL

	constructor(private http: HttpClient) { }

	deleteUser(id: number) {
		return this.http.delete(`${this.apiUrl}/admin/delete`, { body: { userId: id }, responseType: 'text' })
	}

	banUser(id: number) {
		return this.http.patch<string>(`${this.apiUrl}/admin/ban`, { userId: id }, { responseType: 'text' as 'json' })
	}

	reviewReport(id: number) {
		return this.http.patch<Report>(`${this.apiUrl}/reports/${id}/review`, {})
	}

	adminify(id: number) {
		return this.http.patch<string>(`${this.apiUrl}/admin/adminify`, { userId: id }, { responseType: 'text' as 'json' })
	}

	deadminify(id: number) {
		return this.http.patch<string>(`${this.apiUrl}/admin/deadminify`, { userId: id }, { responseType: 'text' as 'json' })
	}

}

