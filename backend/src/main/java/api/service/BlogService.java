package api.service;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import api.model.blog.Blog;
import api.model.blog.BlogRequest;
import api.model.blog.BlogResponse;
import api.model.user.User;
import api.repository.BlogRepository;
import api.repository.UserRepository;
import jakarta.validation.Valid;

@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private static final Set<String> VALID_MEDIA_TYPES = Set.of("image", "video");
    private static final String ERROR_USER_NOT_FOUND = "User not found with ID: %d";

    public BlogService(BlogRepository blogRepository, UserRepository userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    public BlogResponse saveBlog(BlogRequest blogRequest) {
        User user = getAuthenticatedUser();
        validateMediaType(blogRequest.mediaType());
        Blog blog = convertToEntity(blogRequest);
        blog.setUser(user);
        blog.setCreatedAt(LocalDateTime.now());
        return new BlogResponse(this.blogRepository.save(blog), blogRequest.parent());
    }

    public User getAuthenticatedUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, String.format(ERROR_USER_NOT_FOUND, user.getId())));
    }

    public BlogResponse updateBlog(BlogRequest blogRequest, long blogId) {
        long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Blog blog = this.blogRepository
                .findById(blogId)
                .orElseThrow(() -> new IllegalArgumentException("FAILED: there is no post with this ID"));

        if (userId != blog.getUser().getId()) {
            throw new AccessDeniedException("Access denied: You are not authorized to update this blog post");
        }
        validateMediaType(blogRequest.mediaType());
        updateBlogEntity(blog, blogRequest);

        return new BlogResponse(this.blogRepository.save(blog), blogRequest.parent());
    }

    public Blog convertToEntity(BlogRequest blogRequest) {
        Blog blog = new Blog();
        if (blogRequest.parent() != null) {
            Blog parent = this.blogRepository.findById(blogRequest.parent())
                    .orElseThrow(() -> new IllegalArgumentException("FAILED: there is no post with this ID"));
            blog.setParent(parent);
        }
        blog.setCreatedAt(LocalDateTime.now());
        blog.setDescription(blogRequest.description());
        blog.setMediaType(blogRequest.mediaType());
        blog.setMediaUrl(blogRequest.mediaUrl());
        return blog;
    }

    private void validateMediaType(String mediaType) {
        if (mediaType != null && !VALID_MEDIA_TYPES.contains(mediaType.toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Media type must be 'image' or 'video'");
        }
    }

    private void updateBlogEntity(Blog blog, BlogRequest blogRequest) {
        blog.setDescription(blogRequest.description());
        blog.setMediaType(blogRequest.mediaType());
        blog.setMediaUrl(blogRequest.mediaUrl());
        blog.setUpdatedAt(LocalDateTime.now());
    }
}