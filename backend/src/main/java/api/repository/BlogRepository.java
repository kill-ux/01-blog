package api.repository;

import java.time.LocalDateTime;

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
            "WHERE sub.id = :userId AND b.parent IS NULL AND b.hidden = false")
    Page<Blog> findSubscribedUsersBlogsAndIdLessThan(@Param("userId") Long userId, long cursor, Pageable pageable);

    Page<Blog> findByUserSubscribersAndParentIsNullAndIdLessThan(Long userId, long cursor, Pageable pageable);

    Page<Blog> findByUserIdAndParentIsNullAndIdLessThan(Long userId, long cursor, Pageable pageable);

    Page<Blog> findByParentIdAndIdLessThan(Long parentId, long cursor, Pageable pageable);

    long countByParentId(Long parentId);
}

/*
 * 
 * // @Query("SELECT b FROM Blog b WHERE b.parent IS NULL")
 * // Page<Blog> findBlogsWithPagination(Pageable pageable);
 * 
 * 
 * // Page<Blog> findByUserSubscribersAndParentIsNull(Long userId, Pageable
 * pageable);
 * 
 * 
 * // @Query("SELECT b FROM Blog b WHERE b.user.id = :userId AND b.parent IS NULL"
 * )
 * // Page<Blog> findBlogsByUserId(@Param("userId") long userId, Pageable
 * // pageable);
 * 
 * // Page<Blog> findByUserIdAndParentIsNull(Long userId, Pageable pageable);
 * 
 * 
 * // @Query("SELECT b FROM Blog b WHERE b.parent.id = :blogId")
 * // Page<Blog> findChildrenBlogById(@Param("blogId") Long blogId, Pageable
 * // pageable);
 * 
 * 
 * // Page<Blog> findByParentId(Long parentId, Pageable pageable);
 * 
 * 
 * // long countByParentId(long parentId);
 */