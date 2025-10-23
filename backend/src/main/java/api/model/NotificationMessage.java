package api.model;

// NotificationMessage.java

public class NotificationMessage {
    private String type;
    private String message;
    private Object data;

    public NotificationMessage() {}

    public NotificationMessage(String type, String message, Object data) {
        this.type = type;
        this.message = message;
        this.data = data;
    }

    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}