package api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import api.model.notification.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserIdAndIdLessThan(long userId, long cursor, Pageable pageable);
}


