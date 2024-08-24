package me.shazxrin.bloom.dto.overview

import java.time.LocalDate

data class SessionDateTotalDurationDto(
    val date: LocalDate,
    val totalDuration: Long
)
