package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.notification.SessionNotification
import org.springframework.data.repository.CrudRepository

interface SessionNotificationRepository : CrudRepository<SessionNotification, String> {
    fun existsBySessionId(sessionId: String): Boolean
}
