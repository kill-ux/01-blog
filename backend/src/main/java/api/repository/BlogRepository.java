package api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import api.model.blog.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByParentIsNullAndIdLessThan(long cursor, Pageable pageable);

    @Query("SELECT b FROM Blog b " +
            "JOIN b.user author " +
            "JOIN author.subscribers sub " +
            "WHERE b.id < :cursor AND sub.id = :userId AND b.parent IS NULL AND b.hidden = false")
    Page<Blog> findSubscribedUsersBlogs(@Param("userId") Long userId, long cursor, Pageable pageable);

    Page<Blog> findByUserIdAndParentIsNullAndIdLessThan(Long userId, long cursor, Pageable pageable);

    Page<Blog> findByParentIdAndIdLessThan(Long parentId, long cursor, Pageable pageable);

    long countByParentId(Long parentId);
}
