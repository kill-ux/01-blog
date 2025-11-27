import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Report } from '../../blog/model/model';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AdminService {
	private apiUrl = environment.API_URL
    private http = inject(HttpClient)

	deleteUser(id: number) {
		return this.http.delete(`${this.apiUrl}/admin/delete`, { body: { userId: id }, responseType: 'text' as 'json' })
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

