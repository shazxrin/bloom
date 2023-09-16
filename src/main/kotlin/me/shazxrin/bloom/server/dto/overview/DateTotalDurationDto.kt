package me.shazxrin.bloom.server.dto.overview

import java.time.LocalDate

data class DateTotalDurationDto(
    val date: LocalDate,
    val totalDuration: Long
)
