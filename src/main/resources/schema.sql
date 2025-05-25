CREATE TABLE IF NOT EXISTS lesson_materials (
                                                id BIGSERIAL PRIMARY KEY,
                                                material_type VARCHAR(255) NOT NULL,
                                                topic VARCHAR(255) NOT NULL,
                                                ai_response TEXT NOT NULL,
                                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_materials_type ON lesson_materials(material_type);
CREATE INDEX IF NOT EXISTS idx_lesson_materials_topic ON lesson_materials(topic);
CREATE INDEX IF NOT EXISTS idx_lesson_materials_created_at ON lesson_materials(created_at);