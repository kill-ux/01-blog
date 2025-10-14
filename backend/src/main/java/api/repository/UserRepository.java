package api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import api.model.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNickname(String nickname);
    Optional<User> findByEmail(String nickname);

    Optional<User> findByNicknameOrEmail(String nickname, String email);

    @Query("SELECT u FROM User u JOIN u.subscribed_to sub WHERE sub.id = :userId AND u.id < :cursor")
    Page<User> findSubscribersBySubscribedToId(@Param("userId") Long userId,long cursor, Pageable pageable); // AndIdLessThan

    @Query("SELECT u FROM User u JOIN u.subscribers sub WHERE sub.id = :userId AND u.id < :cursor")
    Page<User> findSubscriptionsBySubscribedId(@Param("userId") Long userId,long cursor, Pageable pageable); //IdLessThan

    Page<User> findByIdLessThan(long cursor, Pageable pageable);
}