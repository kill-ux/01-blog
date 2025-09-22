package api.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@WebMvcTest // Remove @SpringBootTest
class BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void shouldReturnAllUsers() throws Exception {
        this.mockMvc
            .perform(MockMvcRequestBuilders.post("/api/auth/login"))
            .andExpect(MockMvcResultMatchers.status().isOk());
    }
}