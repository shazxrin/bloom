package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.session.Session
import me.shazxrin.bloom.server.model.session.SessionStatus
import me.shazxrin.bloom.server.model.session.SessionTag
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.domain.Pageable
import java.time.LocalDateTime

@DataJpaTest
class SessionRepositoryTest @Autowired constructor(
    val sessionRepository: SessionRepository,
    val sessionTagRepository: SessionTagRepository
) {
    @Test
    fun `Find all sessions sorted by start date time`() {
        // Arrange
        val tag = SessionTag(
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val savedTag = sessionTagRepository.save(tag)

        val startDateTime = LocalDateTime.now()
        val session1 = Session(
            name = "Session Test 1",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime.plusMinutes(10),
            endDateTime = startDateTime.plusMinutes(20)
        )
        val session2 = Session(
            name = "Session Test 2",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.PAUSED,
            startDateTime = startDateTime.plusMinutes(20),
            endDateTime = startDateTime.plusMinutes(30),
        )
        val session3 = Session(
            name = "Session Test 3",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.COMPLETED,
            startDateTime = startDateTime.plusMinutes(30),
            endDateTime = startDateTime.plusMinutes(40)
        )
        val savedSessions = sessionRepository.saveAll(listOf(session1, session2, session3))

        // Act
        val resultSessions = sessionRepository.findByIdNotNullOrderByStartDateTimeDesc(Pageable.unpaged())
            .content
            .map { it.id }

        // Assert
        val expectedSessionOrder = savedSessions.map { it.id }.reversed()
        assertIterableEquals(expectedSessionOrder, resultSessions)
    }

    @Test
    fun `Find all sessions by tag id sorted by start date time`() {
        // Arrange
        val tag1 = SessionTag(
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val tag2 = SessionTag(
            name = "Tag Test 2",
            color = "#FFFFFF"
        )
        val savedTags = sessionTagRepository.saveAll(listOf(tag1, tag2))

        val startDateTime = LocalDateTime.now()
        val session1 = Session(
            name = "Session Test 1",
            tag = savedTags.elementAt(0),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime.plusMinutes(10),
            endDateTime = startDateTime.plusMinutes(20)
        )
        val session2 = Session(
            name = "Session Test 2",
            tag = savedTags.elementAt(0),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.PAUSED,
            startDateTime = startDateTime.plusMinutes(20),
            endDateTime = startDateTime.plusMinutes(30),
        )
        val session3 = Session(
            name = "Session Test 3",
            tag = savedTags.elementAt(1),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.COMPLETED,
            startDateTime = startDateTime.plusMinutes(30),
            endDateTime = startDateTime.plusMinutes(40)
        )
        val savedSessions = sessionRepository.saveAll(listOf(session1, session2, session3))

        // Act
        val resultSessions = sessionRepository
            .findByTagIdOrderByStartDateTimeDesc(
                savedTags.elementAt(0).id!!,
                Pageable.unpaged()
            )
            .content
            .map { it.id }

        // Assert
        val expectedSessionOrder = savedSessions
            .filter { it.tag.id == savedTags.elementAt(0).id }
            .map { it.id }
            .reversed()
        assertIterableEquals(expectedSessionOrder, resultSessions)
    }

    @Test
    fun `Find a session by status`() {
        // Arrange
        val tag = SessionTag(
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val savedTag = sessionTagRepository.save(tag)

        val session1 = Session(
            name = "Session Test 1",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        val session2 = Session(
            name = "Session Test 2",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.PAUSED,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        val session3 = Session(
            name = "Session Test 3",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.COMPLETED,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        val savedSessions = sessionRepository.saveAll(listOf(session1, session2, session3))

        // Act
        val resultSession = sessionRepository.findByStatus(SessionStatus.PAUSED)

        // Assert
        assertNotNull(resultSession)
        assertEquals(savedSessions.elementAt(1).id, resultSession!!.id)
    }

    @Test
    fun `Find a session by status in list`() {
        // Arrange
        val tag = SessionTag(
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val savedTag = sessionTagRepository.save(tag)

        val session1 = Session(
            name = "Session Test 1",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        val session2 = Session(
            name = "Session Test 2",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.PAUSED,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        val session3 = Session(
            name = "Session Test 3",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.COMPLETED,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        val savedSessions = sessionRepository.saveAll(listOf(session1, session2, session3))

        // Act
        val resultSession = sessionRepository.findByStatusIn(listOf(SessionStatus.PAUSED))

        // Assert
        assertNotNull(resultSession)
        assertEquals(savedSessions.elementAt(1).id, resultSession!!.id)
    }

    @Test
    fun `Check if a session exists by status in list`() {
        // Arrange
        val tag = SessionTag(
            name = "Tag Test 1",
            color = "#FFFFFF"
        )
        val savedTag = sessionTagRepository.save(tag)

        val session1 = Session(
            name = "Session Test 1",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        val session2 = Session(
            name = "Session Test 2",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.PAUSED,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        val session3 = Session(
            name = "Session Test 3",
            tag = savedTag,
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.COMPLETED,
            startDateTime = LocalDateTime.now(),
            endDateTime = LocalDateTime.now().plusMinutes(10)
        )
        sessionRepository.saveAll(listOf(session1, session2, session3))

        // Act
        val resultSessionExists = sessionRepository.existsByStatusIn(listOf(SessionStatus.PAUSED))

        // Assert
        assertTrue(resultSessionExists)
    }
}
