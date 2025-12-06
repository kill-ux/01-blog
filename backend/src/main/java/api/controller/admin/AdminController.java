package api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.user.UserRequests;
import api.service.UserService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;

/**
 * Controller for administrative actions.
 * Provides endpoints for deleting, banning, and changing the role of users.
 * All endpoints in this controller require ADMIN role.
 */
@RestController
@RequestMapping("/api/admin")
@RateLimiter(name = "myApiLimiter")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Deletes a user by their ID.
     * 
     * @param request A request body containing the user's ID.
     * @return A response entity with a success message.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@Valid @RequestBody UserRequests.UserId request) {
        this.userService.deleteUser(request.userId());
        return ResponseEntity.ok("success delete");
    }

    /**
     * Bans a user by their ID.
     * 
     * @param request A request body containing the user's ID.
     * @return A response entity with a success message.
     */
    @PatchMapping("/ban")
    public ResponseEntity<String> banUser(@Valid @RequestBody UserRequests.UserId request) {
        this.userService.banUser(request.userId());
        return ResponseEntity.ok("success baned");
    }

    /**
     * Grants or revokes admin privileges for a user.
     * 
     * @param request A request body containing the user's ID.
     * @return A response entity with the new role of the user.
     */
    @PatchMapping("/adminify")
    public ResponseEntity<String> adminify(@Valid @RequestBody UserRequests.UserId request) {
        return ResponseEntity.ok(this.userService.adminify(request.userId()));
    }

}
