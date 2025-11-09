package api.service;

import java.util.HashMap;
import java.util.Map;

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
