package me.shazxrin.bloom.server.dto.session.current

import jakarta.validation.constraints.NotEmpty

data class CreateCurrentSessionDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val tagId: String,
    val totalDuration: Long
)
