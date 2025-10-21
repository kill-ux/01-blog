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
		return this.http.delete(`http://localhost:8080/api/admin/delete`, { body: { userId: id }, responseType: 'text' })
	}

	banUser(id: number) {
		return this.http.patch<string>(`http://localhost:8080/api/admin/ban`, { userId: id }, { responseType: 'text' as 'json' })
	}

	reviewReport(id: number) {
		return this.http.patch<Report>(`http://localhost:8080/api/reports/${id}/review`, {})
	}

	adminify(id: number) {
		return this.http.patch<string>(`http://localhost:8080/api/admin/adminify`, { userId: id }, { responseType: 'text' as 'json' })
	}

	deadminify(id: number) {
		return this.http.patch<string>(`http://localhost:8080/api/admin/deadminify`, { userId: id }, { responseType: 'text' as 'json' })
	}

}
