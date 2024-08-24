package me.shazxrin.bloom.service

import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.model.session.Session
import me.shazxrin.bloom.model.session.SessionStatus
import me.shazxrin.bloom.model.session.SessionTag
import me.shazxrin.bloom.repository.SessionRepository
import me.shazxrin.bloom.repository.SessionTagRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.data.repository.findByIdOrNull
import java.time.LocalDateTime

@ExtendWith(MockKExtension::class)
class SessionServiceTest {
    @MockK
    private lateinit var sessionRepository: SessionRepository

    @MockK
    private lateinit var sessionTagRepository: SessionTagRepository

    @InjectMockKs
    private lateinit var sessionService: MainSessionService

    @Test
    fun `Create session`() {
        // Arrange
        val sessionName = "Session Test 1"
        val sessionDuration: Long = 30 * 60
        val sessionStartDateTime = LocalDateTime.now().minusMinutes(30)
        val sessionEndDateTime = LocalDateTime.now()
        val tagId = "test_tag_id_1"
        val tag = SessionTag(
            id = tagId,
            name = "Tag Test 1",
            color = "#FFFFFF"
        )

        every { sessionTagRepository.findByIdOrNull(tagId) } returns tag
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        sessionService.createSession(
            sessionName,
            tagId,
            sessionDuration,
            sessionStartDateTime,
            sessionEndDateTime
        )

        // Assert
        verify {
            sessionRepository.save(withArg {
                assertEquals(sessionName, it.name)
                assertEquals(tag, it.tag)
                assertEquals(sessionDuration, it.totalDuration)
                assertEquals(0, it.remainingDuration)
                assertEquals(sessionDuration, it.usedDuration)
                assertEquals(SessionStatus.COMPLETED, it.status)
                assertEquals(sessionStartDateTime, it.startDateTime)
                assertEquals(sessionEndDateTime, it.endDateTime)
            })
        }
    }

    @Test
    fun `Create session throws when tag not found`() {
        // Arrange
        val sessionName = "Session Test 1"
        val sessionDuration: Long = 30 * 60
        val sessionStartDateTime = LocalDateTime.now().minusMinutes(30)
        val sessionEndDateTime = LocalDateTime.now()
        val tagId = "test_tag_id_1"

        every { sessionTagRepository.findByIdOrNull(tagId) } returns null
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        // Assert
        assertThrows<NotFoundException> {
            sessionService.createSession(
                sessionName,
                tagId,
                sessionDuration,
                sessionStartDateTime,
                sessionEndDateTime
            )
        }
    }

    @Test
    fun `Update session`() {
        // Arrange
        val newSessionName = "New Session Test 1"
        val newSessionDuration: Long = 30 * 60
        val newSessionStartDateTime = LocalDateTime.now().minusMinutes(40)
        val newSessionEndDateTime = LocalDateTime.now().minusMinutes(10)
        val newTagId = "new_test_tag_id_1"
        val newTag = SessionTag(
            id = newTagId,
            name = "New Tag Test 1",
            color = "#00000"
        )

        val tagId = "test_tag_id_1"
        val tag = SessionTag(
            id = tagId,
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val sessionId = "test_session_id_1"
        val session = Session(
            id = sessionId,
            name = "Session Test 1",
            tag = tag,
            status = SessionStatus.COMPLETED,
            totalDuration = 60,
            remainingDuration = 0,
            usedDuration = 60,
            startDateTime = LocalDateTime.now().minusMinutes(30),
            endDateTime = LocalDateTime.now()
        )

        every { sessionRepository.findByIdOrNull(sessionId) } returns session
        every { sessionTagRepository.findByIdOrNull(newTagId) } returns newTag
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        sessionService.updateSession(
            sessionId,
            newSessionName,
            newTagId,
            newSessionDuration,
            newSessionStartDateTime,
            newSessionEndDateTime
        )

        // Assert
        verify {
            sessionRepository.save(withArg {
                assertEquals(newSessionName, it.name)
                assertEquals(newTag, it.tag)
                assertEquals(newSessionDuration, it.totalDuration)
                assertEquals(0, it.remainingDuration)
                assertEquals(newSessionDuration, it.usedDuration)
                assertEquals(SessionStatus.COMPLETED, it.status)
                assertEquals(newSessionStartDateTime, it.startDateTime)
                assertEquals(newSessionEndDateTime, it.endDateTime)
            })
        }
    }

    @Test
    fun `Update session throws when new tag not found`() {
        // Arrange
        val newSessionName = "New Session Test 1"
        val newSessionDuration: Long = 30 * 60
        val newSessionStartDateTime = LocalDateTime.now().minusMinutes(40)
        val newSessionEndDateTime = LocalDateTime.now().minusMinutes(10)
        val newTagId = "new_test_tag_id_1"

        val tagId = "test_tag_id_1"
        val tag = SessionTag(
            id = tagId,
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val sessionId = "test_session_id_1"
        val session = Session(
            id = sessionId,
            name = "Session Test 1",
            tag = tag,
            status = SessionStatus.COMPLETED,
            totalDuration = 60,
            remainingDuration = 0,
            usedDuration = 60,
            startDateTime = LocalDateTime.now().minusMinutes(30),
            endDateTime = LocalDateTime.now()
        )

        every { sessionRepository.findByIdOrNull(sessionId) } returns session
        every { sessionTagRepository.findByIdOrNull(newTagId) } returns null
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        // Assert
        assertThrows<NotFoundException> {
            sessionService.updateSession(
                sessionId,
                newSessionName,
                newTagId,
                newSessionDuration,
                newSessionStartDateTime,
                newSessionEndDateTime
            )
        }
    }
}
