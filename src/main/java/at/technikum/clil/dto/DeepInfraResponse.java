package at.technikum.clil.dto;

import lombok.Data;

import java.util.List;

@Data
public class DeepInfraResponse {
    private String id;
    private String object;
    private long created;
    private String model;
    private List<Choice> choices;
    private Usage usage;

    @Data
    public static class Choice {
        private int index;
        private Message message;
        private String finish_reason;

        @Data
        public static class Message {
            private String role;
            private String content;
            private String name;
            private Object tool_calls;
        }
    }

    @Data
    public static class Usage {
        private int prompt_tokens;
        private int total_tokens;
        private int completion_tokens;
    }
}