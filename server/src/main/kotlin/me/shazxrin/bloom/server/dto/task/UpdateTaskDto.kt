package me.shazxrin.bloom.server.dto.task

import jakarta.validation.constraints.NotEmpty
import java.time.LocalDateTime

data class UpdateTaskDto(
    val name: String,
    val categoryId: String,
    val duration: Long,
    val startTime: LocalDateTime
)
