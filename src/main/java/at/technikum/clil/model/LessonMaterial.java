package at.technikum.clil.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lesson_materials")
public class LessonMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String materialType;  // e.g., "lesson plan", "quiz", "reading exercise"

    @Column(nullable = false)
    private String topic;  // e.g., "Object-Oriented Programming"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String aiResponse;

    @Builder.Default
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}