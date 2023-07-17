package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.TaskNotification
import org.springframework.data.repository.CrudRepository

interface TaskNotificationRepository : CrudRepository<TaskNotification, String> {
    fun existsByTaskId(taskId: String): Boolean
}
