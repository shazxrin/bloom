package me.shazxrin.bloom.dto.task

data class CreateCurrentTaskDto(
    val name: String,
    val categoryId: String,
    val duration: Long
)
