package me.sadmeowkins.bloom.dto.category

import jakarta.validation.constraints.NotEmpty

data class UpdateCategoryDTO(
    @field:NotEmpty val name: String?,
    @field:NotEmpty val color: String?
)
