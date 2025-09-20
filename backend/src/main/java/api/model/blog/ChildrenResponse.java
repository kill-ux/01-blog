package api.model.blog;

import java.util.List;

import lombok.Data;

@Data
public class ChildrenResponse {
    private List<BlogResponse> children;
    private long count;
}
