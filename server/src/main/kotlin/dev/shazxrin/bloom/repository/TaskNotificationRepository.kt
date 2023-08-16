package dev.shazxrin.bloom.repository

import dev.shazxrin.bloom.model.notification.TaskNotification
import org.springframework.data.repository.CrudRepository

interface TaskNotificationRepository : CrudRepository<TaskNotification, String> {
    fun existsByTaskId(taskId: String): Boolean
}
