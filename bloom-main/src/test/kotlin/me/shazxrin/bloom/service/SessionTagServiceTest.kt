package me.shazxrin.bloom.service

import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.model.session.SessionTag
import me.shazxrin.bloom.repository.SessionTagRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.data.repository.findByIdOrNull

@ExtendWith(MockKExtension::class)
class SessionTagServiceTest {
    @MockK
    private lateinit var sessionTagRepository: SessionTagRepository

    @InjectMockKs
    private lateinit var sessionTagService: MainSessionTagService

    @Test
    fun `Create tag`() {
        // Arrange
        val tagName = "Tag Test 1"
        val tagColor = "#FFFFFF"

        every { sessionTagRepository.save(any()) } returnsArgument (0)

        // Act
        sessionTagService.createTag(
            tagName,
            tagColor
        )

        // Assert
        verify {
            sessionTagRepository.save(withArg {
                assertEquals(tagName, it.name)
                assertEquals(tagColor, it.color)
            })
        }
    }

    @Test
    fun `Delete tag`() {
        // Arrange
        val tagId = "test_tag_id_1"

        every { sessionTagRepository.existsById(tagId) } returns true
        every { sessionTagRepository.deleteById(any()) } returnsArgument (0)

        // Act
        sessionTagService.deleteTag(tagId)

        // Assert
        verify {
            sessionTagRepository.deleteById(withArg {
                assertEquals(tagId, it)
            })
        }
    }

    @Test
    fun `Delete tag throws when tag not found`() {
        // Arrange
        val tagId = "test_tag_id_1"

        every { sessionTagRepository.existsById(tagId) } returns false

        // Act
        // Assert
        assertThrows<NotFoundException> {
            sessionTagService.deleteTag(tagId)
        }
    }

    @Test
    fun `Update tag`() {
        // Arrange
        val newTagName = "New Tag Test 1"
        val newTagColor = "#000000"

        val tagId = "test_tag_id_1"
        val tag = SessionTag(
            id = tagId,
            name = "Tag Test 1",
            color = "#FFFFFF"
        )

        every { sessionTagRepository.findByIdOrNull(tagId) } returns tag
        every { sessionTagRepository.save(any()) } returnsArgument (0)

        // Act
        sessionTagService.updateTag(tagId, newTagName, newTagColor)

        // Assert
        verify {
            sessionTagRepository.save(withArg {
                assertEquals(newTagName, it.name)
                assertEquals(newTagColor, it.color)
            })
        }
    }

    @Test
    fun `Update tag throws when tag not found`() {
        // Arrange
        val newTagName = "New Tag Test 1"
        val newTagColor = "#000000"

        val tagId = "test_tag_id_1"

        every { sessionTagRepository.findByIdOrNull(tagId) } returns null

        // Act
        // Assert
        assertThrows<NotFoundException> {
            sessionTagService.updateTag(tagId, newTagName, newTagColor)
        }
    }
}
