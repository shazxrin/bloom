package me.shazxrin.bloom.repository

import me.shazxrin.bloom.model.notification.SessionNotification
import me.shazxrin.bloom.model.session.Session
import me.shazxrin.bloom.model.session.SessionStatus
import me.shazxrin.bloom.model.session.SessionTag
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import java.time.LocalDateTime

@DataJpaTest
class SessionNotificationRepositoryTest @Autowired constructor(
    val sessionRepository: SessionRepository,
    val sessionTagRepository: SessionTagRepository,
    val sessionNotificationRepository: SessionNotificationRepository
) {
    @Test
    fun `Check if a session notification exists by session id`() {
        // Arrange
        val tag = SessionTag(
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val savedTag = sessionTagRepository.save(tag)

        val session = Session(
            name = "Session Test 1",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(20)
        )
        val savedSession = sessionRepository.save(session)

        val sessionNotification = SessionNotification(
            session = savedSession
        )
        sessionNotificationRepository.save(sessionNotification)

        // Act
        val resultSessionNotificationExists = sessionNotificationRepository.existsBySessionId(savedSession.id!!)

        // Assert
        assertTrue(resultSessionNotificationExists)
    }
}
