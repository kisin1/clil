package at.technikum.clil.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeepInfraRequest {
    private List<Message> messages;
    private String model;
    private double temperature;
    private int max_tokens;
    private double top_p;
    private boolean stream;
    private Object stop;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}