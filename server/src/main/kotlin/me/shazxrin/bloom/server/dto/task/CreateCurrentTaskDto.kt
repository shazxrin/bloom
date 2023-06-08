package me.shazxrin.bloom.server.dto.task

import jakarta.validation.constraints.NotEmpty

data class CreateCurrentTaskDto(
    @field:NotEmpty val name: String,
    @field:NotEmpty val categoryId: String,
    val duration: Long
)
