package dev.shazxrin.bloom.server.repository

import dev.shazxrin.bloom.server.model.notification.TaskNotification
import org.springframework.data.repository.CrudRepository

interface TaskNotificationRepository : CrudRepository<TaskNotification, String> {
    fun existsByTaskId(taskId: String): Boolean
}
