package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.Task
import org.springframework.data.repository.CrudRepository

interface TaskRepository : CrudRepository<Task, String> {
    fun findByEndTimeIsNull(): Task?

    fun existsByEndTimeIsNull(): Boolean

    fun findTasksByCategory_IdOrderByStartTime(categoryId: String): Iterable<Task>
}