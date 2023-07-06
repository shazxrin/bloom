package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.TaskNotification
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface TaskNotificationRepository : CoroutineCrudRepository<TaskNotification, String> {
    suspend fun existsByTaskId(taskId: String): Boolean
}
