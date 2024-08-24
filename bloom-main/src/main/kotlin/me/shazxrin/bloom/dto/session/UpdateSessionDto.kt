package me.shazxrin.bloom.dto.session

import jakarta.validation.constraints.NotEmpty
import java.time.LocalDateTime

data class UpdateSessionDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val tagId: String,
    val totalDuration: Long,
    val startDateTime: LocalDateTime,
    val endDateTime: LocalDateTime
)
