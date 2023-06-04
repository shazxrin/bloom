package me.sadmeowkins.bloom.dto.task

import jakarta.validation.constraints.NotEmpty

data class CreateCurrentTaskDTO(
    @field:NotEmpty val name: String,
    @field:NotEmpty val categoryId: String,
    val duration: Long
)
