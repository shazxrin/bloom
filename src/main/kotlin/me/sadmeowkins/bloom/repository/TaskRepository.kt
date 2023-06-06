package me.sadmeowkins.bloom.repository

import me.sadmeowkins.bloom.model.Task
import org.springframework.data.repository.CrudRepository
import java.util.*

interface TaskRepository : CrudRepository<Task, String> {
    fun findByEndTimeIsNull(): Optional<Task>

    fun existsByEndTimeIsNull(): Boolean
}