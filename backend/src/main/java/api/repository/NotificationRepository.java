package api.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import api.model.notification.Notification;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserIdAndIdLessThan(long userId, long cursor, Pageable pageable);

    long countByUserIdAndReadFalse(long userId);

    List<Notification> findByUserId(long userId);
}
