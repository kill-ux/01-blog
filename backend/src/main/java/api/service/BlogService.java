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

    public long getBlogsCount() {
        return this.blogRepository.count();
    }

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

    public User getAuthenticatedUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, String.format(ERROR_USER_NOT_FOUND, user.getId())));
    }

    public BlogResponse getBlog(long blogId) {
        User user = getAuthenticatedUser();
        return this.blogRepository
                .findById(blogId)
                .map(b -> new BlogResponse(b, user.getId()))
                .get();
    }

    @Transactional
    public void deleteBlog(long blogId) {
        this.reportRepository.findByBlogId(blogId).forEach(report -> {
            report.setBlogId(0L);
            this.reportRepository.save(report);
        });

        Blog blog = blogRepository.findById(blogId)
        .orElseThrow(() -> new RuntimeException("Blog not found"));
        this.blogRepository.delete(blog);
    }

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

    // @Transactional
    public BlogResponse updateBlog(BlogRequest blogRequest, long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        blog.setDescription(blogRequest.description());
        blog.setTitle(blogRequest.title());
        blog.setUpdatedAt(LocalDateTime.now());
        Blog savedBlog = this.blogRepository.save(blog);
        return new BlogResponse(savedBlog, blog.getUser().getId());
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

    private void updateBlogEntity(Blog blog, BlogRequest blogRequest) {
        blog.setDescription(blogRequest.description());
        blog.setTitle(blogRequest.title());
        blog.setUpdatedAt(LocalDateTime.now());
    }

    // likes
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

    public Map<String, Integer> getLikes(long blogId) {
        Blog blog = this.blogRepository.findById(blogId).get();
        return Map.of("count", blog.getLikes().size());
    }

}

