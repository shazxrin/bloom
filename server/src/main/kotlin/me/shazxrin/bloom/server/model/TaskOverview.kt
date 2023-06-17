package me.shazxrin.bloom.server.model

data class TaskOverview(
    val tasks: Iterable<Task>,
    val totalDuration: Long,
    val categoriesDuration: Map<Category, Long>
)
