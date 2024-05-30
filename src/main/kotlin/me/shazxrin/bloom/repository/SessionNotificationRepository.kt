package me.shazxrin.bloom.repository

import me.shazxrin.bloom.model.notification.SessionNotification
import org.springframework.data.repository.CrudRepository

interface SessionNotificationRepository : CrudRepository<SessionNotification, String> {
    fun existsBySessionId(sessionId: String): Boolean
}
