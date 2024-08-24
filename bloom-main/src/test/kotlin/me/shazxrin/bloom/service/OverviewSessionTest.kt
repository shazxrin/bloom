package me.shazxrin.bloom.service

import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import me.shazxrin.bloom.repository.OverviewRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@ExtendWith(MockKExtension::class)
class OverviewSessionTest {
    @MockK
    private lateinit var overviewRepository: OverviewRepository

    @InjectMockKs
    private lateinit var overviewService: MainOverviewService

    @Test
    fun `Get daily overview gets correct date range`() {
        // Arrange
        val nowDate = LocalDate.of(2024, 9, 25)

        every { overviewRepository.findSessionsTotalDurationGroupByTag(any(), any()) } returns listOf()

        // Act
        overviewService.getDailyOverview(nowDate)

        // Assert
        val fromDateTime = LocalDateTime.of(
            LocalDate.of(2024, 9, 25),
            LocalTime.MIN
        )
        val toDateTime = LocalDateTime.of(
            LocalDate.of(2024, 9, 25),
            LocalTime.MAX
        )
        verify {
            overviewRepository.findSessionsTotalDurationGroupByTag(
                withArg { assertEquals(fromDateTime, it) },
                withArg { assertEquals(toDateTime, it) }
            )
        }
    }

    @Test
    fun `Get weekly overview gets correct date range`() {
        // Arrange
        val nowDate = LocalDate.of(2024, 9, 25)

        every { overviewRepository.findSessionsTotalDurationGroupByTag(any(), any()) } returns listOf()
        every { overviewRepository.findSessionsTotalDurationGroupByDate(any(), any()) } returns listOf()

        // Act
        overviewService.getWeeklyOverview(nowDate)

        // Assert
        val fromDateTime = LocalDateTime.of(
            LocalDate.of(2024, 9, 23),
            LocalTime.MIN
        )
        val toDateTime = LocalDateTime.of(
            LocalDate.of(2024, 9, 29),
            LocalTime.MAX
        )
        verify {
            overviewRepository.findSessionsTotalDurationGroupByTag(
                withArg { assertEquals(fromDateTime, it) },
                withArg { assertEquals(toDateTime, it) }
            )
            overviewRepository.findSessionsTotalDurationGroupByDate(
                withArg { assertEquals(fromDateTime, it) },
                withArg { assertEquals(toDateTime, it) }
            )
        }
    }

    @Test
    fun `Get yearly overview gets correct date range`() {
        // Arrange
        val year = 2024
        every { overviewRepository.findSessionsTotalDurationGroupByDate(any(), any()) } returns listOf()

        // Act
        overviewService.getYearlyOverview(year)

        // Assert
        val fromDateTime = LocalDateTime.of(
            LocalDate.of(2024, 1, 1),
            LocalTime.MIN
        )
        val toDateTime = LocalDateTime.of(
            LocalDate.of(2024, 12, 31),
            LocalTime.MAX
        )
        verify {
            overviewRepository.findSessionsTotalDurationGroupByDate(
                withArg { assertEquals(fromDateTime, it) },
                withArg { assertEquals(toDateTime, it) }
            )
        }
    }
}
