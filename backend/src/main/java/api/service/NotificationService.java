package api.service;

import java.time.Instant;
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

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyUser(String username, String type, Object data) {
        this.messagingTemplate.convertAndSendToUser(
            username,
            "/queue/notifications",
            Map.of(
                "type", type,
                "data", data,
                "timestamp", Instant.now()
            )
        );
    }

    public void saveNotification(Blog blog) {
        User user = blog.getUser();
        for (User subscriber : user.getSubscribers()) {
            Notification notification = new Notification();
            notification.setBlog(blog);
            notification.setUser(subscriber);
            this.notificationRepository.save(notification);
            this.notifyUser(user.getNickname(), "CREATE_BLOG", notification);
        }
    }

    

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

    public NotificationResponse readNotification(long ntfId, long userId) {
        Notification ntf = this.notificationRepository.findById(ntfId).get();
        if (ntf.getUser().getId() != userId) {
            throw new AccessDeniedException("Access Denied");
        }
        ntf.setRead(true);
        return new NotificationResponse(this.notificationRepository.save(ntf));
    }

    public void readAllNotification(long userId) {
        List<Notification> notfs = this.notificationRepository.findByUserId(userId);
        for (Notification not : notfs) {
            not.setRead(true);
            this.notificationRepository.save(not);
        }
    }
}
