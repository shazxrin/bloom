package me.shazxrin.bloom.dto.session.tag

import jakarta.validation.constraints.NotEmpty

data class CreateTagDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val color: String
)
