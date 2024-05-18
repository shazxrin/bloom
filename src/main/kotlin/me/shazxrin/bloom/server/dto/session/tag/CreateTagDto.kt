package me.shazxrin.bloom.server.dto.session.tag

import jakarta.validation.constraints.NotEmpty

data class CreateTagDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val color: String
)
