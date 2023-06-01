package me.shazxrin.bloom.repository

import me.shazxrin.bloom.model.Task
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository

interface TaskRepository : CoroutineCrudRepository<Task, String> {
    suspend fun findByEndTimeIsNull(): Task?
}