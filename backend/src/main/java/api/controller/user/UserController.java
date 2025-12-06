package api.controller.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import api.controller.blog.FileUploadController;
import api.model.blog.BlogResponse;
import api.model.notification.NotificationResponse;
import api.model.subscription.SubscribeRequest;
import api.model.user.User;
import api.model.user.UserResponse;
import api.service.BlogService;
import api.service.NotificationService;
import api.service.UserService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controller for user-related actions.
 * Provides endpoints for retrieving user information, managing subscriptions,
 * handling notifications, and updating user profiles.
 */
@RestController
@RateLimiter(name = "myApiLimiter")
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final BlogService blogService;
    private final NotificationService notificationService;

    public UserController(UserService userService, BlogService blogService, NotificationService notificationService) {
        this.userService = userService;
        this.blogService = blogService;
        this.notificationService = notificationService;
    }

    /**
     * Retrieves a paginated list of all users.
     * 
     * @param cursor The pagination cursor.
     * @return A list of users.
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(defaultValue = "0") long cursor) {
        List<UserResponse> users = this.userService.getAllUsers(cursor);
        return ResponseEntity.ok(users);
    }

    /**
     * Subscribes the current user to another user.
     * 
     * @param subscribeRequest The request body containing the ID of the user to subscribe to.
     * @return A map indicating the operation performed ("subscribed" or "unsubscribed").
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@Valid @RequestBody SubscribeRequest subscribeRequest) {
        String operation = this.userService.subscribe(subscribeRequest);
        return ResponseEntity.ok(Map.of("operation", operation));
    }

    /**
     * Retrieves a user's profile by their ID.
     * 
     * @param userId The ID of the user to retrieve.
     * @return A map containing the user's profile information.
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, UserResponse>> getUserById(
            @RequestParam long userId) {
        return ResponseEntity.ok(Map.of("user", this.userService.getUserById(userId)));
    }

    /**
     * Updates the current user's profile picture.
     * 
     * @param file The image file to upload.
     * @return A map containing the URL of the uploaded image.
     * @throws IllegalArgumentException if the file type is not an allowed image type.
     */
    @PatchMapping("/updateprofile")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String ext = "";
        if (fileName != null) {
            ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            if (!FileUploadController.ALLOWED_TYPES_IMAGES.contains(ext)) {
                throw new IllegalArgumentException("type not allowed");
            }
        }

        return ResponseEntity.ok(Map.of("url", this.userService.updateProfile(file, ext)));
    }

    /**
     * Retrieves a list of a user's subscribers.
     * 
     * @param userId The ID of the user.
     * @param cursor The pagination cursor.
     * @return A list of the user's subscribers.
     */
    @GetMapping("{userId}/subscribers")
    public ResponseEntity<List<UserResponse>> getSubscribers(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.userService.getSubscribers(userId, cursor));
    }

    /**
     * Retrieves a list of a user's subscriptions.
     * 
     * @param userId The ID of the user.
     * @param cursor The pagination cursor.
     * @return A list of the user's subscriptions.
     */
    @GetMapping("{userId}/subscribtions")
    public ResponseEntity<List<UserResponse>> getSubscriptions(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.userService.getSubscriptions(userId, cursor));
    }

    /**
     * Retrieves a list of blogs created by a specific user.
     * 
     * @param userId The ID of the user.
     * @param cursor The pagination cursor.
     * @return A list of blogs created by the user.
     */
    @GetMapping("{userId}/blogs")
    public ResponseEntity<List<BlogResponse>> getBlogsByUser(
            @PathVariable long userId,
            @RequestParam(defaultValue = "0") long cursor) {
        List<BlogResponse> savedBlog = this.blogService.getBlogsByUser(userId, cursor);
        return ResponseEntity.ok(savedBlog);
    }

    /**
     * Retrieves a list of notifications for the currently authenticated user.
     * 
     * @param user   The currently authenticated user.
     * @param cursor The pagination cursor.
     * @return A map containing the list of notifications and a count of unread notifications.
     */
    @GetMapping("/notification")
    public ResponseEntity<Map<String, Object>> getnotification(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") long cursor) {
        return ResponseEntity.ok(this.notificationService.getNotification(user.getId(), cursor));
    }

    /**
     * Marks a specific notification as read.
     * 
     * @param user  The currently authenticated user.
     * @param ntfId The ID of the notification to mark as read.
     * @return The updated notification.
     */
    @PatchMapping("/notification/{ntfId}/review")
    public ResponseEntity<NotificationResponse> readNotification(
            @AuthenticationPrincipal User user,
            @PathVariable long ntfId) {
        return ResponseEntity.ok(this.notificationService.readNotification(ntfId, user.getId()));
    }

    /**
     * Marks all notifications for the currently authenticated user as read.
     * 
     * @param user The currently authenticated user.
     * @return A map indicating the success of the operation.
     */
    @PatchMapping("/notification/markall") 
    public ResponseEntity<Map<String,String>> readAllNotification(
            @AuthenticationPrincipal User user) {
                this.notificationService.readAllNotification(user.getId());
        return ResponseEntity.ok(Map.of("markAll", "done"));
    }

}
