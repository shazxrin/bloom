package me.shazxrin.bloom.server.schedule

import me.shazxrin.bloom.server.service.TaskNotificationService
import me.shazxrin.bloom.server.service.TaskService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class CurrentTaskCompletionSchedule @Autowired constructor(
    private val taskService: TaskService,
    private val taskNotificationService: TaskNotificationService
) {
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(CurrentTaskCompletionSchedule::class.java)
    }

    @Scheduled(fixedDelay = 10_000)
    fun checkCurrentTaskCompletion() {
        LOGGER.info("Running checkCurrentTaskCompletion scheduled task")
        val currentTask = taskService.getCurrentTask() ?: return

        if (currentTask.id != null && taskNotificationService.checkHasTaskCompletionNotified(currentTask.id)) {
            return
        }

        if (LocalDateTime.now().isAfter(currentTask.lastStartTime.plusSeconds(currentTask.remainingDuration))) {
            LOGGER.info("Notifying current task completion")
            taskNotificationService.notifyCurrentTaskCompletion(currentTask)
        }
    }
}