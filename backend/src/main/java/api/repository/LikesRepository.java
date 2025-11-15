package api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import api.model.like.Like;


@Repository
public interface LikesRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByBlogIdAndUserId(long blogId, long userId);
}
