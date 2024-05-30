package me.shazxrin.bloom.dto.session.current

import me.shazxrin.bloom.model.session.SessionStatus
import java.time.LocalDateTime

data class CurrentSessionTagDto(
    val name: String,
    val color: String
)

data class CurrentSessionDto(
    val name: String,
    val tag: CurrentSessionTagDto,
    val totalDuration: Long,
    val remainingDuration: Long,
    val status: SessionStatus,
    val startDateTime: LocalDateTime,
    val resumeDateTime: LocalDateTime
)
