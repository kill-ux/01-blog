package api.seeder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.IntStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import api.model.blog.Blog;
import api.model.user.User;
import api.repository.BlogRepository;
import api.repository.UserRepository;
import net.datafaker.Faker;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BlogRepository blogRepository;

    public DataLoader(UserRepository userRepository, BlogRepository blogRepository) {
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (this.userRepository.count() >= 10) {
            return;
        }

        // Create and save admin user
        User userAdmin = new User();
        userAdmin.setNickname("admin");
        userAdmin.setEmail("admin@gmail.com");
        userAdmin.setPassword("$2a$10$ooAXC7h9lFD0Gf7DHliYWekayBZ0KMVLWBX6EjmA2NHvZ8Q18LtyO");
        userAdmin.setRole("ROLE_ADMIN");
        userAdmin.setCreatedAt(LocalDateTime.now());
        this.userRepository.save(userAdmin);

        // Create and save test user
        User userTest = new User();
        userTest.setNickname("test");
        userTest.setEmail("test@gmail.com");
        userTest.setPassword("$2a$10$U6RSphWBDit1fvQ1BLSfz.vDf8MrW0Bjj55.7nqMOmrwE9UMtrABm");
        userTest.setRole("ROLE_USER");
        userTest.setCreatedAt(LocalDateTime.now());
        this.userRepository.save(userTest);

        Faker faker = new Faker();

        // Create 100 random users and blogs
        IntStream.range(0, 100).forEach(i -> {
            String nickname = faker.internet().username().replaceAll("[^a-zA-Z0-9_-]", "");
            String email = faker.internet().emailAddress();
            String password = "$2a$10$U6RSphWBDit1fvQ1BLSfz.vDf8MrW0Bjj55.7nqMOmrwE9UMtrABm";
            String role = "ROLE_USER";

            User user = new User();
            user.setNickname(nickname);
            user.setEmail(email);
            user.setPassword(password);
            user.setRole(role);
            user.setCreatedAt(LocalDateTime.now());

            // Save the user first to get a managed entity
            User savedUser = this.userRepository.save(user);

            // Create blog for the saved user
            String description = faker.joke().pun();
            Blog blog = new Blog();
            blog.setTitle(faker.joke().pun());
            blog.setDescription(description);
            blog.setUser(savedUser); // Use the saved (managed) user
            blog.setCreatedAt(LocalDateTime.now());
            this.blogRepository.save(blog);

            // Set up subscriber relationships - FIXED PART
            if (i % 2 == 0) {
                // Add the new user to test user's subscribers
                userTest.getSubscribers().add(savedUser);

                // Add test user to the new user's subscribers (bidirectional)
                savedUser.getSubscribers().add(userTest);
                this.userRepository.save(savedUser); // Save the updated new user
            }
        });

        // Save the updated test user with all subscribers
        this.userRepository.save(userTest);

        System.out.println("Generated 100 random users and blogs");
    }
}