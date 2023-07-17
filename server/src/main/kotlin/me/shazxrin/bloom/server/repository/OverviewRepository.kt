package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.Task
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime

interface OverviewRepository : CrudRepository<Task, String> {
    fun findTasksByStartTimeBetween(fromLocalDateTime: LocalDateTime, endLocalDateTime: LocalDateTime): Iterable<Task>
}
