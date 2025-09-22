package api.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import com.fasterxml.jackson.databind.ObjectMapper;

import api.controller.auth.AuthController;
import api.model.user.UserRecord;
import api.service.UserService;

import static org.mockito.Mockito.when;

@WebMvcTest(AuthController.class)
class BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser
    void signupUser() throws Exception {
        UserRecord request = new UserRecord("user", "user@gmail.com", "1234");

        // Mock UserService behavior
        when(userService.saveUser(request)).thenReturn(request); // Mock saveUser to return the request

        // Perform the request and capture the result
        MvcResult result = this.mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(SecurityMockMvcRequestPostProcessors.csrf()))
                .andDo(MockMvcResultHandlers.print()) // Print full request/response details
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        // Print the response body
        String responseBody = result.getResponse().getContentAsString();
        System.out.println("######################");
        if (responseBody.isEmpty()) {
            System.out.println("Response body is empty");
        } else {
            UserRecord responseUser = objectMapper.readValue(responseBody, UserRecord.class);
            System.out.println("Returned User: " + responseUser);
        }
        System.out.println("######################");
    }
}