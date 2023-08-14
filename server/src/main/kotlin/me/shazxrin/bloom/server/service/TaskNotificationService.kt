package me.shazxrin.bloom.server.service

import me.shazxrin.bloom.server.model.task.Task
import me.shazxrin.bloom.server.model.notification.TaskNotification
import me.shazxrin.bloom.server.repository.TaskNotificationRepository
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

interface TaskNotificationService {
    fun checkHasTaskCompletionNotified(taskId: String): Boolean

    fun notifyCurrentTaskCompletion(task: Task)
}

@Service
class DefaultTaskNotificationService @Autowired constructor(
    private val taskNotificationRepository: TaskNotificationRepository,
    private val rabbitTemplate: RabbitTemplate
) : TaskNotificationService {
    @Value("\${bloom.mq.queue}")
    lateinit var queueName: String

    override fun checkHasTaskCompletionNotified(taskId: String): Boolean {
        return taskNotificationRepository.existsByTaskId(taskId)
    }

    override fun notifyCurrentTaskCompletion(task: Task) {
        rabbitTemplate.convertAndSend(queueName, "<b>[Bloom] :: Timer Completed</b>\n\n${task.name} has been completed")

        taskNotificationRepository.save(TaskNotification(id = null, taskId = task.id ?: ""))
    }
}