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

@RestController
@RequestMapping("/api/admin")
@RateLimiter(name = "myApiLimiter")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@Valid @RequestBody UserRequests.UserId request) {
        this.userService.deleteUser(request.userId());
        return ResponseEntity.ok("success delete");
    }

    @PatchMapping("/ban")
    public ResponseEntity<String> banUser(@Valid @RequestBody UserRequests.UserId request) {
        this.userService.banUser(request.userId());
        return ResponseEntity.ok("success baned");
    }

    @PatchMapping("/adminify")
    public ResponseEntity<String> adminify(@Valid @RequestBody UserRequests.UserId request) {
        return ResponseEntity.ok(this.userService.adminify(request.userId()));
    }

}
