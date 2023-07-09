package me.shazxrin.bloom.server.dto.task

import java.time.LocalDateTime

data class ListTaskDto(
    val id: String,
    val name: String,
    val categoryId: String,
    val duration: Long,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime?
)
