package api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import api.model.notification.Notification;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping(value = "/chat")
    public void SendMessage(@Payload Notification message) {
        messagingTemplate.convertAndSendToUser(message.getRecipient(), "/queue/chat", message.content());

    }
}