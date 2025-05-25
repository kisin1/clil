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

    public Mono<ClilResponse> generateMaterial(String materialType, String topic, String userPrompt) {
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

                    // Save to database with materialType and topic for organization
                    LessonMaterial material = LessonMaterial.builder()
                            .materialType(materialType)
                            .topic(topic)
                            .aiResponse(aiContent)
                            .build();

                    return Mono.fromCallable(() -> repository.save(material))
                            .subscribeOn(Schedulers.boundedElastic())
                            .thenReturn(ClilResponse.builder()
                                    .formattedResponse(aiContent)
                                    .build());
                }).onErrorResume(error -> {
                    // Error handling
                    return Mono.just(ClilResponse.builder()
                            .formattedResponse("<div class='error'><h3>Error generating content</h3><p>" +
                                    error.getMessage() + "</p></div>")
                            .build());
                });
    }
}
