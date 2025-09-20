package api.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import api.model.user.User;
import api.repository.UserRepository;

@Component
public class AuthUtils {
    
    private final UserRepository userRepository;
    
    public AuthUtils(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User getAuthenticatedUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, String.format("User %d not found", user.getId())));
    }
}