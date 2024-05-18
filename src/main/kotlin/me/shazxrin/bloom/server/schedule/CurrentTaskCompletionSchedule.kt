package me.shazxrin.bloom.server.schedule

import me.shazxrin.bloom.server.model.session.SessionStatus
import me.shazxrin.bloom.server.service.SessionNotificationService
import me.shazxrin.bloom.server.service.CurrentSessionService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class CurrentTaskCompletionSchedule @Autowired constructor(
    private val sessionService: CurrentSessionService,
    private val sessionNotificationService: SessionNotificationService
) {
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(CurrentTaskCompletionSchedule::class.java)
    }

    @Scheduled(fixedDelay = 10_000)
    fun checkCurrentTaskCompletion() {
        LOGGER.info("Running checkCurrentTaskCompletion scheduled task")
        val currentSession = sessionService.getCurrentSession() ?: return

        if (currentSession.id != null && sessionNotificationService.checkHasSessionCompletionNotified(currentSession.id!!)) {
            return
        }

        if (currentSession.status == SessionStatus.PAUSED) {
            return
        }

        if (LocalDateTime.now().isAfter(currentSession.modifiedDateTime.plusSeconds(currentSession.remainingDuration))) {
            LOGGER.info("Notifying current task completion")
            sessionNotificationService.notifyCurrentSessionCompletion(currentSession)
        }
    }
}
