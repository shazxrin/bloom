package me.sadmeowkins.bloom.repository

import me.sadmeowkins.bloom.model.Task
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface TaskRepository : CoroutineCrudRepository<Task, String> {
    suspend fun findByEndTimeIsNull(): Task?
}