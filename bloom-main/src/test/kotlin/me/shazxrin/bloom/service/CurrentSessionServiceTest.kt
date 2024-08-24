package me.shazxrin.bloom.service

import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.exception.StateException
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
class CurrentSessionServiceTest {
    @MockK
    private lateinit var sessionRepository: SessionRepository

    @MockK
    private lateinit var sessionTagRepository: SessionTagRepository

    @InjectMockKs
    private lateinit var currentSessionService: MainCurrentSessionService

    @Test
    fun `Create current session when no current session found`() {
        // Arrange
        val sessionName = "Session Test 1"
        val sessionDuration: Long = 60
        val tagId = "test_tag_id_1"
        val tag = SessionTag(
            id = tagId,
            name = "Tag Test 1",
            color = "#FFFFFF"
        )

        every { sessionRepository.existsByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED)) } returns false
        every { sessionTagRepository.findByIdOrNull(tagId) } returns tag
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        currentSessionService.createCurrentSession(
            sessionName,
            tagId,
            sessionDuration
        )

        // Assert
        verify {
            sessionRepository.save(withArg {
                assertEquals(sessionName, it.name)
                assertEquals(tag, it.tag)
                assertEquals(sessionDuration, it.totalDuration)
                assertEquals(sessionDuration, it.remainingDuration)
                assertEquals(SessionStatus.RUNNING, it.status)
                assertNull(it.endDateTime)
            })
        }
    }

    @Test
    fun `Create current session throws when current session running or paused`() {
        // Arrange
        val sessionName = "Session Test 1"
        val sessionDuration: Long = 60
        val tagId = "test_tag_id_1"

        every { sessionRepository.existsByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED)) } returns true

        // Act
        // Assert
        assertThrows<StateException> {
            currentSessionService.createCurrentSession(
                sessionName,
                tagId,
                sessionDuration
            )
        }
    }

    @Test
    fun `Create current session throws when tag not found`() {
        // Arrange
        val sessionName = "Session Test 1"
        val sessionDuration: Long = 60
        val tagId = "test_tag_id_1"

        every { sessionRepository.existsByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED)) } returns false
        every { sessionTagRepository.findByIdOrNull(tagId) } returns null

        // Act
        // Assert
        assertThrows<NotFoundException> {
            currentSessionService.createCurrentSession(
                sessionName,
                tagId,
                sessionDuration
            )
        }
    }

    @Test
    fun `Pause current session when not paused before`() {
        // Arrange
        val tag = SessionTag(
            id = "test_tag_id_1",
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val sessionStartDateTime = LocalDateTime.now().minusMinutes(30)
        val currentSession = Session(
            id = "test_session_id_1",
            name = "Session Test 1",
            tag = tag,
            totalDuration = 3600,
            remainingDuration = 3600,
            status = SessionStatus.RUNNING,
            startDateTime = sessionStartDateTime,
        )

        every { sessionRepository.findByStatus(SessionStatus.RUNNING) } returns currentSession
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        currentSessionService.pauseCurrentSession()

        // Assert
        verify {
            sessionRepository.save(withArg {
                // Remaining duration around 1800 seconds
                assertTrue(it.remainingDuration in 1770..1830)

                // Used duration around 1800 seconds
                assertTrue(it.usedDuration in 1770..1830)

                assertEquals(SessionStatus.PAUSED, it.status)
            })
        }
    }

    @Test
    fun `Pause current session when paused before`() {
        // Arrange
        val tag = SessionTag(
            id = "test_tag_id_1",
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val nowDateTime = LocalDateTime.now()
        val sessionStartDateTime = nowDateTime.minusMinutes(30)
        val currentSession = Session(
            id = "test_session_id_1",
            name = "Session Test 1",
            tag = tag,
            totalDuration = 3600,
            usedDuration = 600,
            remainingDuration = 3000,
            status = SessionStatus.RUNNING,
            startDateTime = sessionStartDateTime,
            resumeDateTime = sessionStartDateTime.plusMinutes(12)
        )

        every { sessionRepository.findByStatus(SessionStatus.RUNNING) } returns currentSession
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        currentSessionService.pauseCurrentSession()

        // Assert
        verify {
            sessionRepository.save(withArg {
                // Remaining duration around 1920 seconds
                assertTrue(it.remainingDuration in 1890..1950)

                // Used duration around 1680 seconds
                assertTrue(it.usedDuration in 1650..1710)

                assertEquals(SessionStatus.PAUSED, it.status)
            })
        }
    }

    @Test
    fun `Pause current session throws when current session is not running`() {
        // Arrange
        every { sessionRepository.findByStatus(SessionStatus.RUNNING) } returns null

        // Act
        // Assert
        assertThrows<StateException> {
            currentSessionService.pauseCurrentSession()
        }
    }

    @Test
    fun `Resume current session when not resumed before`() {
        // Arrange
        val tag = SessionTag(
            id = "test_tag_id_1",
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val sessionStartDateTime = LocalDateTime.now().minusMinutes(30)
        val currentSession = Session(
            id = "test_session_id_1",
            name = "Session Test 1",
            tag = tag,
            totalDuration = 3600,
            remainingDuration = 3600,
            status = SessionStatus.PAUSED,
            startDateTime = sessionStartDateTime,
        )

        every { sessionRepository.findByStatus(SessionStatus.PAUSED) } returns currentSession
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        currentSessionService.resumeCurrentSession()

        // Assert
        verify {
            sessionRepository.save(withArg {
                val nowDateTime = LocalDateTime.now()
                assertTrue(it.resumeDateTime.isBefore(nowDateTime.plusMinutes(1)))
                assertTrue(it.resumeDateTime.isAfter(nowDateTime.minusMinutes(1)))

                assertEquals(SessionStatus.RUNNING, it.status)
            })
        }
    }

    @Test
    fun `Resume current session when resumed before`() {
        // Arrange
        val tag = SessionTag(
            id = "test_tag_id_1",
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val sessionStartDateTime = LocalDateTime.now().minusMinutes(30)
        val currentSession = Session(
            id = "test_session_id_1",
            name = "Session Test 1",
            tag = tag,
            totalDuration = 3600,
            remainingDuration = 3600,
            status = SessionStatus.PAUSED,
            startDateTime = sessionStartDateTime,
            resumeDateTime = sessionStartDateTime.plusMinutes(12)
        )

        every { sessionRepository.findByStatus(SessionStatus.PAUSED) } returns currentSession
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        currentSessionService.resumeCurrentSession()

        // Assert
        verify {
            sessionRepository.save(withArg {
                val nowDateTime = LocalDateTime.now()
                assertTrue(it.resumeDateTime.isBefore(nowDateTime.plusMinutes(1)))
                assertTrue(it.resumeDateTime.isAfter(nowDateTime.minusMinutes(1)))

                assertEquals(SessionStatus.RUNNING, it.status)
            })
        }
    }

    @Test
    fun `Resume current session throws when current session is not paused`() {
        // Arrange
        every { sessionRepository.findByStatus(SessionStatus.PAUSED) } returns null

        // Act
        // Assert
        assertThrows<StateException> {
            currentSessionService.resumeCurrentSession()
        }
    }

    @Test
    fun `End current session when current session running till end of duration`() {
        // Arrange
        val tag = SessionTag(
            id = "test_tag_id_1",
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val sessionStartDateTime = LocalDateTime.now().minusMinutes(60)
        val currentSession = Session(
            id = "test_session_id_1",
            name = "Session Test 1",
            tag = tag,
            totalDuration = 3600,
            remainingDuration = 3600,
            status = SessionStatus.RUNNING,
            startDateTime = sessionStartDateTime,
        )

        every { sessionRepository.findByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED)) } returns currentSession
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        currentSessionService.endCurrentSession()

        // Assert
        verify {
            sessionRepository.save(withArg {
                assertEquals(0, it.remainingDuration)
                assertEquals(3600, it.usedDuration)
                assertEquals(SessionStatus.COMPLETED, it.status)
            })
        }
    }

    @Test
    fun `End current session when current session running till end of duration and paused before`() {
        // Arrange
        val tag = SessionTag(
            id = "test_tag_id_1",
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val sessionStartDateTime = LocalDateTime.now().minusMinutes(62)
        val currentSession = Session(
            id = "test_session_id_1",
            name = "Session Test 1",
            tag = tag,
            totalDuration = 3600,
            usedDuration = 600,
            remainingDuration = 3000,
            status = SessionStatus.RUNNING,
            startDateTime = sessionStartDateTime,
            resumeDateTime = sessionStartDateTime.plusMinutes(12)
        )

        every { sessionRepository.findByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED)) } returns currentSession
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        currentSessionService.endCurrentSession()

        // Assert
        verify {
            sessionRepository.save(withArg {
                assertEquals(0, it.remainingDuration)
                assertEquals(3600, it.usedDuration)
                assertEquals(SessionStatus.COMPLETED, it.status)
            })
        }
    }

    @Test
    fun `End current session when current session paused before end of duration`() {
        // Arrange
        val tag = SessionTag(
            id = "test_tag_id_1",
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val sessionStartDateTime = LocalDateTime.now().minusMinutes(30)
        val currentSession = Session(
            id = "test_session_id_1",
            name = "Session Test 1",
            tag = tag,
            totalDuration = 3600,
            remainingDuration = 1800,
            usedDuration = 1800,
            status = SessionStatus.PAUSED,
            startDateTime = sessionStartDateTime,
        )

        every { sessionRepository.findByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED)) } returns currentSession
        every { sessionRepository.save(any()) } returnsArgument (0)

        // Act
        currentSessionService.endCurrentSession()

        // Assert
        verify {
            sessionRepository.save(withArg {
                assertEquals(0, it.remainingDuration)
                assertEquals(1800, it.usedDuration)
                assertEquals(SessionStatus.COMPLETED, it.status)
            })
        }
    }

    @Test
    fun `End current session throws when current session is not paused or running`() {
        // Arrange
        every { sessionRepository.findByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED)) } returns null

        // Act
        // Assert
        assertThrows<NotFoundException> {
            currentSessionService.endCurrentSession()
        }
    }
}
