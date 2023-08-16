package dev.shazxrin.bloom.dto.task

import jakarta.validation.constraints.NotEmpty
import java.time.LocalDateTime

data class UpdateTaskDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val categoryId: String,
    val duration: Long,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime
)
