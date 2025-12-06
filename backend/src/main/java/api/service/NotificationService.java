package api.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import api.model.blog.Blog;
import api.model.notification.Notification;
import api.model.notification.NotificationResponse;
import api.model.user.User;
import api.repository.NotificationRepository;

/**
 * Service for handling notifications.
 * Provides methods for creating, sending, and managing notifications.
 */
@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Creates and saves notifications for a new blog post.
     * Notifications are sent to the author and all of their subscribers.
     * @param blog The blog post for which to create notifications.
     */
    public void saveNotification(Blog blog) {
        User user = blog.getUser();
        List<User> recipients = new ArrayList<>(user.getSubscribers());
        recipients.add(user);
        
        for (User subscriber : recipients) {
            Notification notification = new Notification();
            notification.setBlog(blog);
            notification.setUser(subscriber);
            this.notificationRepository.save(notification);
            this.sendPrivateNotification(subscriber.getNickname(), notification);
        }
    }

    /**
     * Sends a private WebSocket notification to a specific user.
     * @param username The username of the recipient.
     * @param notification The notification to send.
     */
    public void sendPrivateNotification(String username, Notification notification) {
        String destination = "/queue/new-blog";

        messagingTemplate.convertAndSendToUser(
                username, 
                destination, 
                new NotificationResponse(notification) 
        );

        System.out.println("Sent message to " + username + " at " + destination);
    }

    /**
     * Retrieves a paginated list of notifications for a user.
     * @param userId The ID of the user.
     * @param cursor The pagination cursor.
     * @return A map containing the list of notifications and the count of unread notifications.
     */
    public Map<String, Object> getNotification(long userId, long cursor) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt", "id").descending());
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        ;
        return Map.of("notfs", this.notificationRepository
                .findByUserIdAndIdLessThan(userId, cursor, pageable)
                .map(NotificationResponse::new)
                .toList(), "count", this.notificationRepository.countByUserIdAndReadFalse(userId));
    }

    /**
     * Marks a specific notification as read.
     * @param ntfId The ID of the notification.
     * @param userId The ID of the user who owns the notification.
     * @return The updated notification.
     * @throws AccessDeniedException if the user does not own the notification.
     */
    public NotificationResponse readNotification(long ntfId, long userId) {
        Notification ntf = this.notificationRepository.findById(ntfId).get();
        if (ntf.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied");
        }
        ntf.setRead(true);
        return new NotificationResponse(this.notificationRepository.save(ntf));
    }

    /**
     * Marks all notifications for a user as read.
     * @param userId The ID of the user.
     */
    public void readAllNotification(long userId) {
        List<Notification> notfs = this.notificationRepository.findByUserId(userId);
        for (Notification not : notfs) {
            not.setRead(true);
            this.notificationRepository.save(not);
        }
    }
}