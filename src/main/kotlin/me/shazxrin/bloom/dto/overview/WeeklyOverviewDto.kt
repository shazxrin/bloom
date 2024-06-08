package me.shazxrin.bloom.dto.overview

data class WeeklyOverviewDto(
    val sessionTagTotalDurations: List<SessionTagTotalDurationDto>,
    val sessionDateTotalDurations: List<SessionDateTotalDurationDto>
)
