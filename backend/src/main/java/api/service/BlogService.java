package api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import api.model.blog.Blog;
import api.model.blog.BlogRequest;
import api.model.blog.BlogResponse;
import api.model.blog.ChildrenResponse;
import api.model.like.Like;
import api.model.user.User;
import api.repository.BlogRepository;
import api.repository.LikesRepository;
import api.repository.ReportRepository;
import api.repository.UserRepository;

/**
 * Service for handling blog-related business logic.
 * Provides methods for creating, retrieving, updating, deleting, and interacting with blogs.
 */
@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final LikesRepository likesRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    private final NotificationService notificationService;
    private static final String ERROR_USER_NOT_FOUND = "User not found with ID: %d";

    public BlogService(BlogRepository blogRepository, UserRepository userRepository,
            NotificationService notificationService, CloudinaryService cloudinaryService,
            ReportRepository reportRepository, LikesRepository likesRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.reportRepository = reportRepository;
        this.likesRepository = likesRepository;
    }

    /**
     * Retrieves a paginated list of all blogs.
     * @param cursor The pagination cursor.
     * @return A list of blogs.
     */
    public List<BlogResponse> getBlogs(long cursor) {
        User user = getAuthenticatedUser();
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return this.blogRepository
                .findByParentIsNullAndIdLessThan(cursor, pageable)
                .stream()
                .map(b -> new BlogResponse(b, user.getId()))
                .toList();
    }

    /**
     * Retrieves the total count of all blogs.
     * @return The total blog count.
     */
    public long getBlogsCount() {
        return this.blogRepository.count();
    }

    /**
     * Retrieves blogs from the user's network.
     * @param cursor The pagination cursor.
     * @return A list of blogs from the user's network.
     */
    public List<BlogResponse> getBlogsNetworks(long cursor) {
        User user = getAuthenticatedUser();
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return this.blogRepository
                .findSubscribedUsersBlogs(user.getId(), cursor, pageable)
                .stream()
                .map(b -> new BlogResponse(b, user.getId()))
                .toList();
    }

    /**
     * Retrieves a list of blogs created by a specific user.
     * @param userId The ID of the user.
     * @param cursor The pagination cursor.
     * @return A list of blogs created by the user.
     */
    public List<BlogResponse> getBlogsByUser(long userId, long cursor) {
        User user = getAuthenticatedUser();
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return this.blogRepository
                .findByUserIdAndParentIsNullAndIdLessThanAndHiddenFalse(userId, cursor, pageable)
                .stream()
                .map(b -> new BlogResponse(b, user.getId()))
                .toList();
    }

    /**
     * Saves a new blog post.
     * @param blogRequest The request body containing blog details.
     * @return The saved blog post.
     */
    @Transactional
    public BlogResponse saveBlog(BlogRequest blogRequest) {
        User user = getAuthenticatedUser();
        // validateMediaType(blogRequest.mediaType());
        Blog blog = convertToEntity(blogRequest);
        blog.setUser(user);
        blog.setCreatedAt(LocalDateTime.now());
        Blog savedBlog = this.blogRepository.save(blog);
        // save notifaction
        if (blogRequest.parent() == null) {
            this.notificationService.saveNotification(savedBlog);
        }
        return new BlogResponse(savedBlog, user.getId());
    }

    /**
     * Retrieves the currently authenticated user.
     * @return The authenticated user.
     * @throws ResponseStatusException if the user is not found.
     */
    public User getAuthenticatedUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, String.format(ERROR_USER_NOT_FOUND, user.getId())));
    }

    /**
     * Retrieves a single blog post by its ID.
     * @param blogId The ID of the blog to retrieve.
     * @return The requested blog post.
     */
    public BlogResponse getBlog(long blogId) {
        User user = getAuthenticatedUser();
        return this.blogRepository
                .findById(blogId)
                .map(b -> new BlogResponse(b, user.getId()))
                .get();
    }

    /**
     * Deletes a blog post by its ID.
     * @param blogId The ID of the blog to delete.
     */
    @Transactional
    public void deleteBlog(long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        this.reportRepository.findByBlogId(blog.getId()).forEach(report -> {
            report.setBlogId(0L);
            this.reportRepository.save(report);
        });
        this.blogRepository.deleteById(blog.getId());
    }

    /**
     * Retrieves the children (comments) of a blog post.
     * @param blogId The ID of the parent blog.
     * @param cursor The pagination cursor.
     * @return A response containing the children of the blog.
     */
    public ChildrenResponse getBlogChildren(long blogId, long cursor) {
        User user = getAuthenticatedUser();
        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt", "id").descending());
        Page<Blog> page;
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        page = this.blogRepository.findByParentIdAndIdLessThanAndHiddenFalse(blogId, cursor, pageable);

        ChildrenResponse children = new ChildrenResponse();
        children.setChildren(page.stream().map(blog -> new BlogResponse(blog, false, user.getId())).toList());
        children.setCount(this.blogRepository.countByParentId(blogId));
        return children;
    }

    /**
     * Updates an existing blog post.
     * @param blogRequest The request body containing updated blog details.
     * @param blogId The ID of the blog to update.
     * @return The updated blog post.
     */
    @Transactional
    public BlogResponse updateBlog(BlogRequest blogRequest, long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        blog.setDescription(blogRequest.description());
        blog.setTitle(blogRequest.title());
        blog.setUpdatedAt(LocalDateTime.now());
        return new BlogResponse(this.blogRepository.save(blog), blog.getUser().getId());
    }

    /**
     * Hides a blog post.
     * @param blogId The ID of the blog to hide.
     * @return The new hidden status of the blog.
     */
    public boolean hideBlog(long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        blog.setHidden(!blog.isHidden());
        this.blogRepository.save(blog);
        return blog.isHidden();
    }

    /**
     * Converts a BlogRequest DTO to a Blog entity.
     * @param blogRequest The BlogRequest DTO.
     * @return The converted Blog entity.
     */
    public Blog convertToEntity(BlogRequest blogRequest) {
        Blog blog = new Blog();
        if (blogRequest.parent() != null) {
            Blog parent = this.blogRepository.findById(blogRequest.parent())
                    .orElseThrow(() -> new IllegalArgumentException("FAILED: there is no post with this ID"));
            blog.setParent(parent);
        } else {
            if (blogRequest.title() == null || blogRequest.title().trim() == "") {
                throw new IllegalArgumentException("must be to set the title");
            }
            blog.setTitle(blogRequest.title());
        }
        blog.setCreatedAt(LocalDateTime.now());
        blog.setDescription(blogRequest.description());
        return blog;
    }

    /**
     * Updates a Blog entity from a BlogRequest DTO.
     * @param blog The Blog entity to update.
     * @param blogRequest The BlogRequest DTO containing the new data.
     */
    private void updateBlogEntity(Blog blog, BlogRequest blogRequest) {
        blog.setDescription(blogRequest.description());
        blog.setTitle(blogRequest.title());
        blog.setUpdatedAt(LocalDateTime.now());
    }

    /**
     * Toggles a 'like' on a blog post.
     * @param blogId The ID of the blog to like or unlike.
     * @return A map containing the change in the number of likes (1 for like, -1 for unlike).
     */
    public Map<String, Integer> likeBlog(long blogId) {
        User user = getAuthenticatedUser();
        Blog blog = this.blogRepository.findById(blogId).get();
        Like like = this.likesRepository.findByBlogIdAndUserId(blogId, user.getId()).orElse(null);
        if (like == null) {
            like = new Like();
            like.setBlog(blog);
            like.setUser(user);
            this.likesRepository.save(like);
            return Map.of("like", 1);
        } else {
            System.out.println(like.getId());
            this.likesRepository.delete(like);
            return Map.of("like", -1);
        }
    }

    /**
     * Retrieves the total number of likes for a blog post.
     * @param blogId The ID of the blog.
     * @return A map containing the total number of likes.
     */
    public Map<String, Integer> getLikes(long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        return Map.of("count", blog.getLikes().size());
    }

}
