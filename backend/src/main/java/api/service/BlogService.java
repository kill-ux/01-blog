package api.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import api.model.blog.Blog;
import api.model.blog.BlogRequest;
import api.repository.BlogRepository;

@Service
public class BlogService {

    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public Blog saveBlog(BlogRequest blogRequest) {
        Blog blog = convertToEntity(blogRequest);
        blog.setCreatedAt(LocalDateTime.now());
        return this.blogRepository.save(blog);
    }

    public Blog convertToEntity(BlogRequest blogRequest) {
        Blog blog = new Blog();
        // blog.setUser(blogRequest.userId());
        blog.setDescription(blogRequest.description());
        blog.setMedia_type(blogRequest.media_type());
        blog.setMedia_url(blogRequest.media_url());
        return blog;
    }
}