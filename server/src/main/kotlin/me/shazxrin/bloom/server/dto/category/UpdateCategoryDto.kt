package me.shazxrin.bloom.server.dto.category

import jakarta.validation.constraints.NotEmpty

data class UpdateCategoryDto(
    @field:NotEmpty val name: String?,
    @field:NotEmpty val color: String?
)
