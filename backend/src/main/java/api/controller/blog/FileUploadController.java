package api.controller.blog;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private Clou
    
    @PostMapping
    public void uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println("###########################################");
        System.out.println(file);

        System.out.println("###########################################");
    }
}
