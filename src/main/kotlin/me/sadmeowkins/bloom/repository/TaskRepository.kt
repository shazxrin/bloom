package me.sadmeowkins.bloom.repository

import me.sadmeowkins.bloom.model.Task
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository

interface TaskRepository : CoroutineCrudRepository<me.sadmeowkins.bloom.model.Task, String> {
    suspend fun findByEndTimeIsNull(): me.sadmeowkins.bloom.model.Task?
}