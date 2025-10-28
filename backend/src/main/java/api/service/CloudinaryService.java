package api.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

import jakarta.annotation.Resource;

@Service
public class CloudinaryService {
    @Resource
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folderName, String resourceType) {
        try {
            HashMap<Object, Object> options = new HashMap<>();
            options.put("folder", folderName);
            options.put("resource_type", resourceType);
            Map<String, Object> uploadedFile = cloudinary.uploader().upload(file.getBytes(), options);
            String publicId = (String) uploadedFile.get("public_id");
            return cloudinary.url().secure(true).resourcType(resourceType).generate(publicId);
        } catch (Exception e) {
            System.out.println(e);
            throw new IllegalArgumentException("Faild: to upload this filed");
        }
    }

    public void deleteFile(String publicId,String resource_type) {
        try {
            HashMap<Object, Object> options = new HashMap<>();
            options.put("folder", "files");
            options.put("resource_type",resource_type);
            Map result = cloudinary.uploader().destroy(publicId, options);
            System.out.println("Deleted: " + publicId + " - " + result.get("result"));
        } catch (Exception e) {
            System.out.println("Failed to delete: " + publicId + " - " + e.getMessage());
        }
    }

    // Simple method to find all Cloudinary URLs in content
    public List<String> findCloudinaryUrls(String content) {
        List<String> urls = new ArrayList<>();
        if (content == null)
            return urls;

        // Simple regex to find Cloudinary URLs
        Pattern pattern = Pattern.compile("https://res\\.cloudinary\\.com/[^\\s)\"]+");
        Matcher matcher = pattern.matcher(content);

        while (matcher.find()) {
            urls.add(matcher.group());
        }
        return urls;
    }

    // In CloudinaryService - update the getPublicIdFromUrl method
    public String getPublicIdFromUrl(String cloudinaryUrl) {
        try {
            // Remove query parameters first
            String cleanUrl = cloudinaryUrl.split("\\?")[0];

            // URL format:
            // https://res.cloudinary.com/dbwhdxois/image/upload/v1/files/esbwar9qd42ctnemhmed
            String[] parts = cleanUrl.split("/upload/");
            if (parts.length < 2)
                return null;

            String pathAfterUpload = parts[1];

            // Remove version part (v1/) if present
            if (pathAfterUpload.startsWith("v")) {
                pathAfterUpload = pathAfterUpload.substring(pathAfterUpload.indexOf('/') + 1);
            }

            // Remove file extension if present
            int lastDot = pathAfterUpload.lastIndexOf('.');
            if (lastDot > 0) {
                pathAfterUpload = pathAfterUpload.substring(0, lastDot);
            }

            return pathAfterUpload;
        } catch (Exception e) {
            System.out.println("Error parsing URL: " + cloudinaryUrl);
            return null;
        }
    }
}
