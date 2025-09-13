package api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import api.model.blog.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {}