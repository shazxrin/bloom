package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.Task
import org.springframework.data.repository.CrudRepository
import java.util.*

interface TaskRepository : CrudRepository<Task, String> {
    fun findByEndTimeIsNull(): Optional<Task>

    fun existsByEndTimeIsNull(): Boolean
}