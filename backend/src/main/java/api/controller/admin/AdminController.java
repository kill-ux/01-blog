package api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.model.user.UserRequests;
import api.service.UserService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody UserRequests.UserId userId) {
        this.userService.deleteUser(userId.userId());
        return ResponseEntity.ok("success delete");
    }

    @PatchMapping("/ban")
    public ResponseEntity<String> banUser(@RequestBody UserRequests.BanRequest request) {
        this.userService.banUser(request.userId(),request.until());
        return ResponseEntity.ok("success delete");
    }
}
