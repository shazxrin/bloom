package me.shazxrin.bloom.dto.task

import java.time.LocalDateTime

data class CurrentTaskDto(
    val name: String,
    val categoryId: String,
    val duration: Long,
    val remainingDuration: Long,
    val isPaused: Boolean,
    val startTime: LocalDateTime,
    val lastStartTime: LocalDateTime
)
