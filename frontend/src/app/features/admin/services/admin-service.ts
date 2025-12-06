import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Report } from '../../blog/model/model';
import { environment } from '../../../../environments/environment';

/**
 * Service for administrative actions.
 * Provides methods for deleting users, banning users, reviewing reports, and managing admin privileges.
 */
@Injectable({
	providedIn: 'root'
})
export class AdminService {
	private apiUrl = environment.API_URL
    private http = inject(HttpClient)

	/**
	 * Deletes a user.
	 * @param id The ID of the user to delete.
	 * @returns An observable of the HTTP response.
	 */
	deleteUser(id: number) {
		return this.http.delete(`${this.apiUrl}/admin/delete`, { body: { userId: id }, responseType: 'text' as 'json' })
	}

	/**
	 * Bans a user.
	 * @param id The ID of the user to ban.
	 * @returns An observable of the HTTP response.
	 */
	banUser(id: number) {
		return this.http.patch<string>(`${this.apiUrl}/admin/ban`, { userId: id }, { responseType: 'text' as 'json' })
	}

	/**
	 * Reviews a report.
	 * @param id The ID of the report to review.
	 * @returns An observable of the updated report.
	 */
	reviewReport(id: number) {
		return this.http.patch<Report>(`${this.apiUrl}/reports/${id}/review`, {})
	}

	/**
	 * Grants admin privileges to a user.
	 * @param id The ID of the user to make an admin.
	 * @returns An observable of the HTTP response.
	 */
	adminify(id: number) {
		return this.http.patch<string>(`${this.apiUrl}/admin/adminify`, { userId: id }, { responseType: 'text' as 'json' })
	}

	/**
	 * Revokes admin privileges from a user.
	 * @param id The ID of the user to remove admin privileges from.
	 * @returns An observable of the HTTP response.
	 */
	deadminify(id: number) {
		return this.http.patch<string>(`${this.apiUrl}/admin/deadminify`, { userId: id }, { responseType: 'text' as 'json' })
	}

}
