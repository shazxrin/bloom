package me.shazxrin.bloom.server.dto.session.current

import me.shazxrin.bloom.server.model.session.SessionStatus
import java.time.LocalDateTime

data class CurrentSessionDto(
    val name: String,
    val tagId: String,
    val totalDuration: Long,
    val remainingDuration: Long,
    val status: SessionStatus,
    val startDateTime: LocalDateTime,
    val modifiedDateTime: LocalDateTime
)
