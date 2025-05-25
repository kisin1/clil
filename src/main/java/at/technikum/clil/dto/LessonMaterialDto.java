package at.technikum.clil.dto;

import at.technikum.clil.model.LessonMaterial;

public record LessonMaterialDto(
        Long id,
        String materialType,
        String topic,
        String formattedHtml,
        String createdAt // or use LocalDateTime
) {
    public static LessonMaterialDto fromEntity(LessonMaterial entity) {
        return new LessonMaterialDto(
                entity.getId(),
                entity.getMaterialType(),
                entity.getTopic(),
                entity.getAiResponse(), // or format if needed
                entity.getCreatedAt().toString()
        );
    }
}
