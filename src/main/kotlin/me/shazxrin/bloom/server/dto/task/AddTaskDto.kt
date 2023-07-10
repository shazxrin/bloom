package me.shazxrin.bloom.server.dto.task

import jakarta.validation.constraints.NotEmpty
import java.time.LocalDateTime

data class AddTaskDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val categoryId: String,
    @field:NotEmpty val duration: Long,
    @field:NotEmpty val startTime: LocalDateTime
)
