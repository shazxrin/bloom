package dev.shazxrin.bloom.server.dto.task

import jakarta.validation.constraints.NotEmpty
import java.time.LocalDateTime

data class AddTaskDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val categoryId: String,
    val duration: Long,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime
)
