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
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody UserRequests.UserId request) {
        this.userService.deleteUser(request.userId());
        return ResponseEntity.ok("success delete");
    }

    @PatchMapping("/ban")
    public ResponseEntity<String> banUser(@Valid @RequestBody UserRequests.UserId request) {
        System.out.println("##################");
        System.out.println(request.userId());
        this.userService.banUser(request.userId());
        return ResponseEntity.ok("success baned");
    }

    @PatchMapping("/adminify")
    public ResponseEntity<String> adminify(@RequestBody UserRequests.UserId request) {
        return ResponseEntity.ok(this.userService.adminify(request.userId()));
    }

     @PatchMapping("/deadminify")
    public ResponseEntity<String> deadminify(@RequestBody UserRequests.UserId request) {
        return ResponseEntity.ok(this.userService.deadminify(request.userId())); 
    }
}
