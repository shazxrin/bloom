package me.shazxrin.bloom.dto.session

import java.time.LocalDateTime

data class ListSessionTagDto(
    val id: String,
    val name: String,
    val color: String
)

data class ListSessionDto(
    val id: String,
    val name: String,
    val tag: ListSessionTagDto,
    val totalDuration: Long,
    val startDateTime: LocalDateTime,
    val endDateTime: LocalDateTime?
)
