package api.controller.blog;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.util.file.ConfigurationSource.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import api.service.CloudinaryService;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private CloudinaryService cloudinaryService;
    public static List<String> ALLOWED_TYPES_IMAGES = List.of("jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp",
            "svg");
    public static List<String> ALLOWED_TYPES_VEDIOS = List.of("mp4", "avi", "mov", "wmv", "flv", "webm", "mkv", "m4v");

    public FileUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String resourceType = "";
        if (fileName != null) {
            String ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            if (ALLOWED_TYPES_IMAGES.contains(ext)) {
                resourceType = "image";
            } else if (ALLOWED_TYPES_VEDIOS.contains(ext)) {
                resourceType = "video";
            } else {
                throw new IllegalArgumentException("type not allowed");
            }
        }
        return ResponseEntity.ok(Map.of("url", cloudinaryService.uploadFile(file, "files", resourceType)));
    }

    // @GetMapping("/images/{filename}")
    // public ResponseEntity<Resource>getImage(@PathVariable String filename) {
    //     try {
    //         Path filePath = Paths.get(uploadDir).resolve(filename);
    //         Resource resource = new UrlResource(filePath.toUri());

    //         if (resource.exists()) {
    //             return ResponseEntity.ok()
    //                     .contentType(MediaType.IMAGE_JPEG)
    //                     .body(resource);
    //         } else {
    //             return ResponseEntity.notFound().build();
    //         }
    //     } catch (MalformedURLException e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //     }
    // }
}
