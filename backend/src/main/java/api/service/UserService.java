package api.service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import api.model.blog.Blog;
import api.model.subscription.SubscribeRequest;
import api.model.user.LoginRequest;
import api.model.user.LoginResponse;
import api.model.user.User;
import api.model.user.UserRecord;
import api.model.user.UserResponse;
import api.repository.UserRepository;
import jakarta.validation.Valid;

/**
 * Service for user-related business logic.
 * Provides methods for user registration, authentication, profile management, and social features.
 */
@Service
public class UserService {
    private final UserRepository userRepository;
    private final BlogService blogService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final AuthUtils authUtils;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager, JwtService jwtService, AuthUtils authUtils,BlogService blogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.authUtils = authUtils;
        this.blogService = blogService;
    }

    /**
     * Returns the UserRepository instance.
     * @return The UserRepository instance.
     */
    public UserRepository getUserRepository() {
        return this.userRepository;
    }

    /**
     * Retrieves a paginated list of all users.
     * @param cursor The pagination cursor.
     * @return A list of users.
     */
    public List<UserResponse> getAllUsers(long cursor) {
        long id = this.authUtils.getAuthenticatedUser().getId();
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return this.userRepository
                .findByIdLessThan(cursor, pageable)
                .stream()
                .map(u -> new UserResponse(u, id))
                .filter(u -> u.getId() != id)
                .toList();
    }

    /**
     * Retrieves a user's profile by their ID.
     * @param id The ID of the user to retrieve.
     * @return The user's profile information.
     */
    public UserResponse getUserById(long id) {
        long userId = this.authUtils.getAuthenticatedUser().getId();

        return this.userRepository
                .findById(id)
                .map(user -> new UserResponse(user, userId)).get();
    }

    /**
     * Saves a new user to the database.
     * @param userRecord The user data for registration.
     * @return The saved user record.
     * @throws IllegalStateException if the email or username already exists.
     */
    public UserRecord saveUser(@Valid UserRecord userRecord) {

        User user = convertToEntity(userRecord);
        user.setRole("ROLE_USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        User savedUser;
        try {
            savedUser = this.userRepository.save(user);
            return convertToDTO(savedUser);
        } catch (Exception e) {
            String errorMessage = e.getMessage();
            String err = "Data conflict - please check your input";
            if ((errorMessage.contains("nickname") || errorMessage.contains("email")) && errorMessage.contains("unique")) {
                err = "Email or Username already exists";
            }
            throw new IllegalStateException(err);
        }
    }

    /**
     * Deletes a user by their ID.
     * @param id The ID of the user to delete.
     */
    public void deleteUser(long id) {
        // User user = this.userRepository.findById(id).get();
        // we need to remove all likes of this user
        // user.getLikedBlogs().clear();
        // user.getBlogs().forEach(blog -> {
        //     this.blogService.deleteBlog(blog.getId());
        // });
        this.userRepository.deleteById(id);
    }

    /**
     * Updates the current user's profile picture.
     * @param file The image file to upload.
     * @param ext The file extension.
     * @return The URL of the uploaded image.
     */
    @Transactional
    public String updateProfile(MultipartFile file, String ext) {
        long userId = this.authUtils.getAuthenticatedUser().getId();
        User user = this.userRepository.findById(userId).get();

        // Define the absolute file system path (from our MvcConfig)
        // String uploadDir = "/app/uploads";

        // --- 1. Delete Old Image Logic ---
        String oldAvatarUrl = user.getAvatar(); // Get URL from DB (e.g., "/images/1.png")

        // Check if an old avatar URL exists
        if (oldAvatarUrl != null && !oldAvatarUrl.isEmpty()) {
            try {
                // Get just the file name (e.g., "1.png")
                String oldFileName = Paths.get(oldAvatarUrl).getFileName().toString();

                // Build the full absolute path to the old file
                Path oldFilePath = Paths.get(uploadDir, oldFileName);

                // Delete the file if it exists
                Files.deleteIfExists(oldFilePath);
                System.out.println("Successfully deleted old avatar: " + oldFilePath);

            } catch (IOException e) {
                // Log the error, but don't stop the upload.
                // The new file is more important.
                System.err.println("Error deleting old avatar: " + e.getMessage());
                e.printStackTrace();
            }
        }
        // --- End Deletion Logic ---

        // --- 2. Save New Image Logic (Same as before) ---
        String newFileName = userId + "." + ext;
        Path newFilePath = Paths.get(uploadDir, newFileName);

        try {
            // Ensure the directory exists
            Files.createDirectories(Paths.get(uploadDir));

            // Write the new file
            try (FileOutputStream fos = new FileOutputStream(newFilePath.toString())) {
                byte[] bytes = file.getBytes();
                fos.write(bytes);
            }

            // Update the user's avatar URL in the database to the new path
            String newAvatarUrl = "/images/" + newFileName;
            user.setAvatar(newAvatarUrl);
            this.userRepository.save(user);

            System.out.println("Data successfully written to: " + newFilePath);
            return user.getAvatar();

        } catch (Exception e) {
            // This is a critical error, so we throw an exception
            e.printStackTrace();
            throw new RuntimeException("Error uploading new file: " + e.getMessage(), e);
        }
    }

    /**
     * Bans or un-bans a user.
     * @param id The ID of the user to ban/un-ban.
     */
    // @Transactional
    public void banUser(long id) {
        User user = this.userRepository.findById(id).get();
        user.setBannedUntil(!user.isBannedUntil());
        userRepository.save(user);
    }

    /**
     * Grants or revokes admin privileges for a user.
     * @param id The ID of the user.
     * @return The new role of the user.
     */
    public String adminify(long id) {
        System.out.println(id);
        User user = this.userRepository.findById(id).get();
        if (user.getRole().equals("ROLE_USER")) {
            user.setRole("ROLE_ADMIN");
        } else {
            user.setRole("ROLE_USER");
        }
        userRepository.save(user);
        return user.getRole();
    }

    /**
     * Converts a UserRecord DTO to a User entity.
     * @param userRecord The UserRecord DTO.
     * @return The converted User entity.
     */
    private User convertToEntity(UserRecord userRecord) {
        User user = new User();
        user.setId(userRecord.id());
        user.setNickname(userRecord.nickname());
        user.setEmail(userRecord.email().toLowerCase());
        user.setPassword(userRecord.password());
        user.setRole(userRecord.role());
        user.setAvatar(userRecord.avatar());
        user.setBannedUntil(userRecord.bannedUntil());
        user.setBirthDate(userRecord.birthDate());
        user.setCreatedAt(userRecord.createdAt());
        user.setUpdatedAt(userRecord.updatedAt());
        return user;
    }

    /**
     * Converts a User entity to a UserRecord DTO.
     * @param user The User entity.
     * @return The converted UserRecord DTO.
     */
    private UserRecord convertToDTO(User user) {
        return new UserRecord(user.getId(), user.getNickname(), user.getEmail(), user.getPassword(), user.getRole(),
                user.getAvatar(), user.isBannedUntil(), user.getBirthDate(), user.getCreatedAt(), user.getUpdatedAt());
    }

    /**
     * Authenticates a user and returns a JWT token upon successful login.
     * @param loginRequest The login credentials.
     * @return A response containing the JWT token and expiration time.
     * @throws BadCredentialsException if the credentials are invalid.
     */
    public LoginResponse login(@Valid LoginRequest loginRequest) {
        try {
            // Authenticate credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.nickname(), loginRequest.password()));
            // Load the full user details after successful authentication
            User user = (User) authentication.getPrincipal();
            // Generate token with user details (not just nickname)
            String jwtToken = jwtService.generateToken(user);
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(jwtToken);
            loginResponse.setExpiresIn(jwtService.getExpirationTime());
            return loginResponse;

        } catch (LockedException e) {
            throw e;
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    /**
     * Subscribes the current user to another user.
     * @param subscribeRequest The request containing the ID of the user to subscribe to.
     * @return A string indicating the operation performed ("subscribed" or "unsubscribed").
     */
    public String subscribe(SubscribeRequest subscribeRequest) {
        long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();

        if (userId == subscribeRequest.subscriberToId()) {
            throw new IllegalArgumentException("you can't subscribe yourself");
        }

        User user = userRepository.findById(userId).get();
        User target = userRepository.findById(subscribeRequest.subscriberToId())
                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));
        boolean isSubscribed = target.getSubscribers().contains(user);
        String operation = "subscribed";
        if (isSubscribed) {
            target.getSubscribers().remove(user);
            operation = "unsubscribed";
        } else {
            target.getSubscribers().add(user);
        }

        userRepository.save(target);
        return operation;
    }

    /**
     * Retrieves a list of a user's subscribers.
     * @param userId The ID of the user.
     * @param cursor The pagination cursor.
     * @return A list of the user's subscribers.
     */
    public List<UserResponse> getSubscribers(long userId, long cursor) {
        long id = this.authUtils.getAuthenticatedUser().getId();
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return this.userRepository
                .findSubscribersBySubscribedToId(userId, cursor, pageable)
                .stream()
                .map(u -> new UserResponse(u, id))
                .toList();
    }

    /**
     * Retrieves a list of a user's subscriptions.
     * @param userId The ID of the user.
     * @param cursor The pagination cursor.
     * @return A list of the user's subscriptions.
     */
    public List<UserResponse> getSubscriptions(long userId, long cursor) {
        long id = this.authUtils.getAuthenticatedUser().getId();
        Pageable pageable = PageRequest.of(0, 10, Direction.DESC, "id");
        if (cursor == 0) {
            cursor = Long.MAX_VALUE;
        }
        return this.userRepository
                .findSubscriptionsBySubscribedId(userId, cursor, pageable)
                .stream()
                .map(u -> new UserResponse(u, id))
                .toList();
    }

}
