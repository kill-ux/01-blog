package api.model.subscription;

import jakarta.validation.constraints.NotNull;

public record SubscribeRequest(@NotNull(message = "subscriber_to_id is required") Long subscriberToId) {}