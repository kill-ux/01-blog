package api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import api.model.blog.Blog;
import api.model.blog.BlogRequest;
import api.model.blog.BlogResponse;
import api.model.user.User;
import api.repository.BlogRepository;
import api.repository.UserRepository;

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

    public List<BlogResponse> getBlogs(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Direction.DESC, "id");
        return this.blogRepository
                .findByParentIsNull(pageable)
                .stream()
                .map(BlogResponse::new)
                .toList();
    }

    public List<BlogResponse> getBlogsNetworks(int pageNumber) {
        User user = getAuthenticatedUser();
        Pageable pageable = PageRequest.of(pageNumber, 10, Direction.DESC, "id");
        return this.blogRepository
                .findSubscribedUsersBlogs(user.getId(), pageable)
                .stream()
                .map(BlogResponse::new)
                .toList();
    }

    public List<BlogResponse> getBlogsByUser(long userId ,int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Direction.DESC, "id");
        return this.blogRepository
                .findByUserIdAndParentIsNull(userId, pageable)
                .stream()
                .map(BlogResponse::new)
                .toList();
    }

    public BlogResponse saveBlog(BlogRequest blogRequest) {
        User user = getAuthenticatedUser();
        validateMediaType(blogRequest.mediaType());
        Blog blog = convertToEntity(blogRequest);
        blog.setUser(user);
        blog.setCreatedAt(LocalDateTime.now());
        return new BlogResponse(this.blogRepository.save(blog));
    }

    public User getAuthenticatedUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, String.format(ERROR_USER_NOT_FOUND, user.getId())));
    }

    public BlogResponse getBlog(long blogId) {
        return this.blogRepository.findById(blogId).map(BlogResponse::new).get();
    }

    public void deleteBlog(long blogId) {
        this.blogRepository.findById(blogId).get();
        this.blogRepository.deleteById(blogId);
    }

    public List<BlogResponse> getBlogChildren(long blogId, int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Direction.DESC, "id");
        return this.blogRepository
                .findByParentId(blogId, pageable)
                .stream()
                .map(BlogResponse::new)
                .toList();
    }

    public BlogResponse updateBlog(BlogRequest blogRequest, long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        validateMediaType(blogRequest.mediaType());
        updateBlogEntity(blog, blogRequest);
        return new BlogResponse(this.blogRepository.save(blog));
    }

    public boolean hideBlog(long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        blog.setHidden(!blog.isHidden());
        this.blogRepository.save(blog);
        return blog.isHidden();
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

    // likes
    public Map<String, Integer> likeBlog(long blogId) {
        User user = getAuthenticatedUser();
        Blog blog = this.blogRepository.findById(blogId).get();
        boolean isLiked = user.getLikedBlogs().contains(blog);
        if (!isLiked) {
            blog.getLikedBy().add(user);
            this.blogRepository.save(blog);
            return Map.of("like", 1);
        } else {
            blog.getLikedBy().remove(user);
            this.blogRepository.save(blog);
            return Map.of("like", -1);
        }
    }

    public Map<String, Integer> getLikes(long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        return Map.of("count", blog.getLikedBy().size());
    }
}