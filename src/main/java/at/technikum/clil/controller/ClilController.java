package at.technikum.clil.controller;

import at.technikum.clil.dto.ClilResponse;
import at.technikum.clil.dto.LessonMaterialDto;
import at.technikum.clil.dto.MaterialRequest;
import at.technikum.clil.repository.LessonMaterialRepository;
import at.technikum.clil.service.ClilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/v1/clil")
@CrossOrigin(origins = {"http://localhost:63342", "http://localhost:5173"})

public class ClilController {

    private final ClilService clilService;
    private final LessonMaterialRepository repository;

    public ClilController(ClilService clilService, LessonMaterialRepository repository) {
        this.clilService = clilService;
        this.repository = repository;
    }

    @PostMapping("/generate")
    public Mono<ResponseEntity<ClilResponse>> generateLessonMaterial(
            @RequestBody MaterialRequest request) {
        return clilService.generateMaterial(
                        request.getMaterialType(),
                        request.getTopic(),
                        request.getPrompt()
                )
                .timeout(Duration.ofSeconds(60))
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.internalServerError()
                        .body(ClilResponse.builder()
                                .formattedResponse("<div class='error'>Failed to generate content</div>")
                                .build()));
    }

    @GetMapping("/materials")
    public ResponseEntity<List<LessonMaterialDto>> getAllMaterials() {
        List<LessonMaterialDto> dtos = repository.findAllOrderByCreatedAtDesc()
                .stream()
                .map(LessonMaterialDto::fromEntity)
                .toList();

        return ResponseEntity.ok(dtos);
    }



    @GetMapping("/materials/{id}")
    public ResponseEntity<LessonMaterialDto> getMaterial(@PathVariable Long id) {
        return repository.findById(id)
                .map(LessonMaterialDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/materials/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}