package api.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import api.model.blog.Blog;
import api.model.user.User;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    @Query("SELECT b FROM Blog b WHERE b.parent IS NULL")
    Page<Blog> findBlogsWithPagination(Pageable pageable);

    @Query("SELECT b FROM Blog b WHERE b.parent.id = :blogId")
    Page<Blog> findChildrenBlogById(@Param("blogId") Long blogId, Pageable pageable);

    // @Query("SELECT b FROM Blog b WHERE b.parent IS NOT NULL")
    // List<Blog> findChildsBlogWithPagination();
}