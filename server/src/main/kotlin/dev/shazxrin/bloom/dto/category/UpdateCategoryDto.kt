package dev.shazxrin.bloom.dto.category

import jakarta.validation.constraints.NotEmpty

data class UpdateCategoryDto(
    @field:NotEmpty val name: String?,
    @field:NotEmpty val color: String?
)
