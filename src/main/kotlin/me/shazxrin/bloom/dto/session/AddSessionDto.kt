package me.shazxrin.bloom.dto.session

import jakarta.validation.constraints.NotEmpty
import java.time.LocalDateTime

data class AddSessionDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val tagId: String,
    val totalDuration: Long,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime
)
