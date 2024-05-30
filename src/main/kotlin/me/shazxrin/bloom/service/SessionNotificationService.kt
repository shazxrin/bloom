package me.shazxrin.bloom.service

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
    private val rabbitTemplate: RabbitTemplate
) : SessionNotificationService {
    @Value("\${bloom.mq.queue}")
    lateinit var queueName: String

    override fun checkHasSessionCompletionNotified(sessionId: String): Boolean {
        return sessionNotificationRepository.existsBySessionId(sessionId)
    }

    override fun notifyCurrentSessionCompletion(session: Session) {
        rabbitTemplate.convertAndSend(queueName, "<b>[Bloom] :: Timer Completed</b>\n\n${session.name} has been completed")

        sessionNotificationRepository.save(SessionNotification(id = null, session = session))
    }
}
