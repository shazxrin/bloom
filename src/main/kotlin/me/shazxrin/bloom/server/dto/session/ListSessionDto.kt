package me.shazxrin.bloom.server.dto.session

import java.time.LocalDateTime

data class ListSessionDto(
    val id: String,
    val name: String,
    val tagId: String,
    val totalDuration: Long,
    val startDateTime: LocalDateTime,
    val endDateTime: LocalDateTime?
)
