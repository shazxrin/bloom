package me.shazxrin.bloom.service

import me.shazxrin.bloom.dto.notification.NotificationMessageDto
import me.shazxrin.bloom.model.session.Session
import me.shazxrin.bloom.model.notification.SessionNotification
import me.shazxrin.bloom.repository.SessionNotificationRepository
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

interface SessionNotificationService {
    fun checkHasSessionCompletionNotified(sessionId: String): Boolean

    fun notifyCurrentSessionCompletion(session: Session)
}

@Service
class MainSessionNotificationService @Autowired constructor(
    private val sessionNotificationRepository: SessionNotificationRepository,
    private val rabbitTemplate: RabbitTemplate,
    @Value("\${bloom.notification-queue-name}") private val notificationQueueName: String
) : SessionNotificationService {
    override fun checkHasSessionCompletionNotified(sessionId: String): Boolean {
        return sessionNotificationRepository.existsBySessionId(sessionId)
    }

    override fun notifyCurrentSessionCompletion(session: Session) {
        rabbitTemplate.convertAndSend(
            notificationQueueName,
            NotificationMessageDto(
                "Bloom",
                "Timer Completed",
                "${session.name} session for tag ${session.tag.name} has completed"
            )
        )

        sessionNotificationRepository.save(SessionNotification(id = null, session = session))
    }
}
