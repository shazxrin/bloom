package me.shazxrin.bloom.dto.overview

data class SessionTagTotalDurationSessionTagDto(
    val id: String,
    val name: String,
    val color: String
)

data class SessionTagTotalDurationDto(
    val tag: SessionTagTotalDurationSessionTagDto,
    val totalDuration: Long
)
