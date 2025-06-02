package at.technikum.clil.service;

import at.technikum.clil.dto.ClilResponse;
import at.technikum.clil.dto.DeepInfraRequest;
import at.technikum.clil.dto.DeepInfraResponse;
import at.technikum.clil.model.LessonMaterial;
import at.technikum.clil.repository.LessonMaterialRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Service
@Transactional
public class ClilService {

    private final WebClient webClient;
    private final PromptService promptService;
    private final LessonMaterialRepository repository;

    public ClilService(@Qualifier("deepInfraWebClient") WebClient webClient,
                       PromptService promptService,
                       LessonMaterialRepository repository) {
        this.webClient = webClient;
        this.promptService = promptService;
        this.repository = repository;
    }

    public Mono<ClilResponse> generateMaterial(
            String materialType, 
            String topic, 
            String userPrompt,
            String subject,
            String languageLevel,
            Integer vocabPercentage,
            String contentFocus,
            Boolean includeVocabList,
            String description) {
        
        // Validate required parameters
        if (materialType == null || materialType.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Material type cannot be null or empty"));
        }
        if (topic == null || topic.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Topic cannot be null or empty"));
        }
        if (userPrompt == null || userPrompt.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("User prompt cannot be null or empty"));
        }
        if (subject == null || subject.trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Subject cannot be null or empty"));
        }

        // Set default values for optional parameters
        final String finalLanguageLevel = (languageLevel != null && !languageLevel.trim().isEmpty()) ? languageLevel : "B1";
        final Integer finalVocabPercentage = (vocabPercentage != null) ? vocabPercentage : 30;
        final String finalContentFocus = (contentFocus != null && !contentFocus.trim().isEmpty()) ? contentFocus : "balanced";
        final Boolean finalIncludeVocabList = (includeVocabList != null) ? includeVocabList : true;
        final String finalDescription = (description != null) ? description : "";
        final String finalMaterialType = materialType.trim();
        final String finalTopic = topic.trim();
        final String finalSubject = subject.trim();

        // Get system prompt - enhanced for HTML output
        String systemPrompt = promptService.getTrainingPrompt();
        String enhancedUserPrompt = userPrompt +
                "\n\nIMPORTANT: Please format your response using proper HTML tags for better presentation. " +
                "Use headings (<h1>, <h2>, <h3>), paragraphs (<p>), lists (<ul>, <ol>, <li>), " +
                "emphasis (<strong>, <em>), and other appropriate HTML elements. " +
                "Please provide a well-structured HTML response that can be directly rendered in a web application.";

        // Create API request
        DeepInfraRequest.Message systemMessage = DeepInfraRequest.Message.builder()
                .role("system")
                .content(systemPrompt)
                .build();

        DeepInfraRequest.Message userMessage = DeepInfraRequest.Message.builder()
                .role("user")
                .content(enhancedUserPrompt)
                .build();

        DeepInfraRequest request = DeepInfraRequest.builder()
                .messages(List.of(systemMessage, userMessage))
                .model("meta-llama/Llama-3.3-70B-Instruct-Turbo")
                .temperature(0.7)
                .max_tokens(2048)
                .top_p(0.9)
                .stream(false)
                .build();

        // Call API and process response
        return webClient.post()
                .bodyValue(request)
                .retrieve()
                .bodyToMono(DeepInfraResponse.class)
                .flatMap(response -> {
                    if (response.getChoices() == null || response.getChoices().isEmpty()) {
                        return Mono.error(new IllegalStateException("No choices returned from DeepInfra API."));
                    }
                    String aiContent = response.getChoices().getFirst().getMessage().getContent();

                    // Generate tags from subject and topic
                    List<String> tags = List.of(
                        finalSubject.toLowerCase(),
                        finalTopic.toLowerCase().split("\\s+")[0]
                    ).stream()
                    .filter(tag -> !tag.isEmpty())
                    .toList();

                    // Return response without saving to database
                    return Mono.just(ClilResponse.builder()
                            .formattedResponse(aiContent)
                            .build());
                }).onErrorResume(error -> {
                    String errorMessage;
                    if (error instanceof IllegalArgumentException) {
                        errorMessage = error.getMessage();
                    } else if (error instanceof IllegalStateException) {
                        errorMessage = "API Error: " + error.getMessage();
                    } else {
                        errorMessage = "Unexpected error occurred: " + error.getMessage();
                    }
                    return Mono.just(ClilResponse.builder()
                            .formattedResponse("<div class='error'><h3>Error generating content</h3><p>" +
                                    errorMessage + "</p></div>")
                            .build());
                });
    }
}
