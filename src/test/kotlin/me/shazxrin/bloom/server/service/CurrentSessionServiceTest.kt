package me.shazxrin.bloom.server.service

import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import me.shazxrin.bloom.server.model.session.SessionStatus
import me.shazxrin.bloom.server.model.session.SessionTag
import me.shazxrin.bloom.server.repository.SessionRepository
import me.shazxrin.bloom.server.repository.SessionTagRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.data.repository.findByIdOrNull

@ExtendWith(MockKExtension::class)
class CurrentSessionServiceTest {
    @MockK
    private lateinit var sessionRepository: SessionRepository

    @MockK
    private lateinit var sessionTagRepository: SessionTagRepository

    @InjectMockKs
    private lateinit var currentSessionService: DefaultCurrentSessionService

    @Test
    fun `Create current session normal`() {
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
        every { sessionTagRepository.findByIdOrNull(tag.id!!) } returns tag
        every { sessionRepository.save(any()) } returnsArgument(0)

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
}
