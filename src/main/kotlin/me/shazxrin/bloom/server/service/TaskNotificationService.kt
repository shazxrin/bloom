package me.shazxrin.bloom.server.service

import me.shazxrin.bloom.server.model.Task
import me.shazxrin.bloom.server.model.TaskNotification
import me.shazxrin.bloom.server.repository.TaskNotificationRepository
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

interface TaskNotificationService {
    suspend fun checkHasTaskCompletionNotified(taskId: String): Boolean

    suspend fun notifyCurrentTaskCompletion(task: Task)
}

@Service
class DefaultTaskNotificationService @Autowired constructor(
    private val taskNotificationRepository: TaskNotificationRepository,
    private val rabbitTemplate: RabbitTemplate
) : TaskNotificationService {
    @Value("\${bloom.mq.queue}")
    lateinit var queueName: String

    override suspend fun checkHasTaskCompletionNotified(taskId: String): Boolean {
        return taskNotificationRepository.existsByTaskId(taskId)
    }

    override suspend fun notifyCurrentTaskCompletion(task: Task) {
        rabbitTemplate.convertAndSend(queueName, "<b>[Bloom] :: Timer Completed</b>\n\n${task.name} has been completed")

        taskNotificationRepository.save(TaskNotification(taskId = task.id))
    }
}