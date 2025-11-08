package api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
/**
 * dfsdfsd
 */
@Configuration
public class CloudinaryConfig {
    @Value("${app.cloudinary.cloud-url}")
    private String cloudUrl;

    @Bean
    public Cloudinary cloudinary(){
        return new Cloudinary(cloudUrl);
    }
}
