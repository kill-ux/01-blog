import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthState, MostReport, User } from '../../auth/models/model';
import { BlogResponce, Notification, NotificationResponce, Report } from '../../blog/model/model';
import { environment } from '../../../../environments/environment';

/**
 * Service for user-related operations, interacting with the backend API.
 * Provides methods for fetching user data, managing subscriptions, handling notifications, and updating profiles.
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }
    private apiUrl = environment.API_URL

    /**
     * Retrieves a list of users with pagination.
     * @param cursor The ID of the last user retrieved, used for pagination.
     * @returns An Observable of an array of User objects.
     */
    getUsers(cursor: number) {
        return this.http.get<User[]>(`${this.apiUrl}/users?cursor=${cursor}`)
    }

    /**
     * Retrieves a list of subscribers for a given user with pagination.
     * @param userId The ID of the user whose subscribers to retrieve.
     * @param cursor The ID of the last subscriber retrieved, used for pagination.
     * @returns An Observable of an array of User objects (subscribers).
     */
    getSubscribers(userId: number, cursor: number) {
        return this.http.get<User[]>(`${this.apiUrl}/users/${userId}/subscribers?cursor=${cursor}`)
    }

    /**
     * Retrieves a list of users that a given user is subscribed to, with pagination.
     * @param userId The ID of the user whose subscriptions to retrieve.
     * @param cursor The ID of the last subscribed user retrieved, used for pagination.
     * @returns An Observable of an array of User objects (subscriptions).
     */
    getSubscribtions(userId: number, cursor: number) {
        return this.http.get<User[]>(`${this.apiUrl}/users/${userId}/subscribtions?cursor=${cursor}`)
    }

    /**
     * Retrieves a user's profile information by their ID.
     * @param userId The ID of the user whose profile to retrieve.
     * @returns An Observable of the AuthState containing the user's profile.
     */
    getUserById(userId: any) {
        return this.http.get<AuthState>(`${this.apiUrl}/users/profile?userId=${userId}`)
    }

    /**
     * Subscribes to or unsubscribes from a user.
     * @param id The ID of the user to subscribe to.
     * @returns An Observable indicating the success of the subscription/unsubscription operation.
     */
    subscribe(id: number) {
        return this.http.post<{ operation: string }>(`${this.apiUrl}/users/subscribe`, { subscriberToId: id })
    }

    /**
     * Retrieves blog posts created by a specific user.
     * @param userId The ID of the user whose blog posts to retrieve.
     * @returns An Observable of an array of BlogResponce objects.
     */
    getBlogsByUserId(userId: any) {
        return this.http.get<BlogResponce[]>(`${this.apiUrl}/users/${userId}/blogs`)
    }

    /**
     * Retrieves the total number of blog posts in the system.
     * @returns An Observable containing an object with the total count of posts.
     */
    getNumberOfPosts() {
        return this.http.get<{count: number}>(`${this.apiUrl}/blogs/count`)
    }

    /**
     * Retrieves a list of users who have been reported the most.
     * @returns An Observable of an array of MostReport objects.
     */
    getMostReportedUsers(){
        return this.http.get<MostReport[]>(`${this.apiUrl}/reports/mostreported`)
    }

    /**
     * Updates the current user's profile picture.
     * @param file The image file to upload as the new avatar.
     * @returns An Observable containing the URL of the newly uploaded avatar.
     */
    updateProfile(file: File) {
        const formData = new FormData();
        formData.append('file', file)
        return this.http.patch<{ url: string }>(`${this.apiUrl}/users/updateprofile`, formData)
    }

    /**
     * Retrieves a list of notifications for the current user with pagination.
     * @param cursor The ID of the last notification retrieved, used for pagination.
     * @returns An Observable of a NotificationResponce object.
     */
    getNotifications(cursor: number) {
        return this.http.get<NotificationResponce>(`${this.apiUrl}/users/notification?cursor=${cursor}`)
    }

    /**
     * Marks a specific notification as read.
     * @param id The ID of the notification to mark as read.
     * @returns An Observable of the updated Notification.
     */
    markRead(id: number) {
        return this.http.patch<Notification>(`${this.apiUrl}/users/notification/${id}/review`, {})
    }

    /**
     * Marks all notifications for the current user as read.
     * @returns An Observable that completes when all notifications are marked as read.
     */
    markAll() {
        return this.http.patch<Notification>(`${this.apiUrl}/users/notification/markall`, {})
    }

    /**
     * Retrieves a list of reports with pagination.
     * @param cursor The ID of the last report retrieved, used for pagination.
     * @returns An Observable of an array of Report objects.
     */
    getReports(cursor: number) {
        return this.http.get<Report[]>(`${this.apiUrl}/reports?cursor=${cursor}`)
    }
}
