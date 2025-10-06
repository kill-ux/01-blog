package api.controller.blog;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
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
    private List<String> ALLOWED_TYPES = List.of("jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "svg");

    public FileUploadController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println("###########################################");
        String fileName = file.getOriginalFilename();
        if (fileName != null) {
            String ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            if (!ALLOWED_TYPES.contains(ext)) {
                throw new IllegalArgumentException("type not allowed");
            }
        }
        return ResponseEntity.ok(Map.of("url", cloudinaryService.uploadFile(file, "files")));
    }
}
