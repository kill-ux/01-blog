package api.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

import jakarta.annotation.Resource;

/**
 * Service for interacting with the Cloudinary API.
 * Provides methods for uploading files to Cloudinary.
 */
@Service
public class CloudinaryService {
    @Resource
    private Cloudinary cloudinary;

    /**
     * Uploads a file to Cloudinary.
     * @param file The multipart file to upload.
     * @param folderName The name of the folder in Cloudinary to upload the file to.
     * @param resourceType The type of the resource being uploaded (e.g., "image", "video").
     * @return The secure URL of the uploaded file.
     * @throws InternalError if the file upload fails.
     */
    public String uploadFile(MultipartFile file, String folderName, String resourceType) {
        try {
            HashMap<Object, Object> options = new HashMap<>();
            options.put("folder", folderName);
            options.put("resource_type", resourceType);
            // remove warning of th row map witout tpe
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadedFile = cloudinary.uploader().upload(file.getBytes(), options);
            return (String) uploadedFile.get("secure_url");
        } catch (Exception e) {
            System.out.println(e);
            throw new InternalError("Failed: to upload this file");
        }
    }
}
