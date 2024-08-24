package me.shazxrin.bloom.repository

import me.shazxrin.bloom.model.session.Session
import me.shazxrin.bloom.model.session.SessionStatus
import me.shazxrin.bloom.model.session.SessionTag
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import java.time.LocalDateTime

@DataJpaTest
class OverviewRepositoryTest @Autowired constructor(
    val sessionRepository: SessionRepository,
    val sessionTagRepository: SessionTagRepository,
    val overviewRepository: OverviewRepository
) {
    @Test
    fun `Find sessions total duration grouped by tag`() {
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
        val endDateTime = startDateTime.plusSeconds(1)
        // All sessions are 60 seconds
        // Session 1 -> Tag 1 -> Within start and end
        val session1 = Session(
            name = "Session Test 1",
            tag = savedTags.elementAt(0),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime,
            endDateTime = endDateTime
        )
        // Session 2 -> Tag 1 -> Within start and end
        val session2 = Session(
            name = "Session Test 2",
            tag = savedTags.elementAt(0),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime,
            endDateTime = endDateTime
        )
        // Session 3 -> Tag 2 -> Within start and end
        val session3 = Session(
            name = "Session Test 3",
            tag = savedTags.elementAt(1),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime,
            endDateTime = endDateTime
        )
        // Session 4 -> Tag 2 -> OUTSIDE start and end
        val session4 = Session(
            name = "Session Test 4",
            tag = savedTags.elementAt(1),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime.plusDays(10),
            endDateTime = endDateTime.plusDays(10)
        )
        sessionRepository.saveAll(listOf(session1, session2, session3, session4))

        // Act
        // Range captured one day before and after the start date time used for the sessions
        val resultsSessionTagTotalDuration = overviewRepository.findSessionsTotalDurationGroupByTag(
            startDateTime.minusDays(1),
            startDateTime.plusDays(1)
        )

        // Assert
        for (sessionTagTotalDuration in resultsSessionTagTotalDuration) {
            when (sessionTagTotalDuration.tag.id) {
                savedTags.elementAt(0).id -> assertEquals(120, sessionTagTotalDuration.totalDuration)
                savedTags.elementAt(1).id -> assertEquals(60, sessionTagTotalDuration.totalDuration)
                else -> fail("Unknown session tag total duration found!")
            }
        }
    }

    @Test
    fun `Find sessions total duration grouped by date`() {
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
        val endDateTime = startDateTime.plusSeconds(1)
        // All sessions are 60 seconds
        // Session 1 -> Tag 1 -> Within start and end
        val session1 = Session(
            name = "Session Test 1",
            tag = savedTags.elementAt(0),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime.plusDays(0),
            endDateTime = endDateTime.plusDays(0)
        )
        // Session 2 -> Tag 1 -> Within start and end
        val session2 = Session(
            name = "Session Test 2",
            tag = savedTags.elementAt(0),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime.plusDays(1),
            endDateTime = endDateTime.plusDays(1)
        )
        // Session 3 -> Tag 2 -> Within start and end
        val session3 = Session(
            name = "Session Test 3",
            tag = savedTags.elementAt(1),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime.plusDays(2),
            endDateTime = endDateTime.plusDays(2)
        )
        // Session 4 -> Tag 2 -> OUTSIDE start and end
        val session4 = Session(
            name = "Session Test 4",
            tag = savedTags.elementAt(1),
            totalDuration = 60,
            remainingDuration = 0,
            status = SessionStatus.RUNNING,
            startDateTime = startDateTime.plusDays(10),
            endDateTime = endDateTime.plusDays(10)
        )
        sessionRepository.saveAll(listOf(session1, session2, session3, session4))

        // Act
        // Range captured within five days after the start date time used for the sessions
        val resultsSessionTagTotalDuration = overviewRepository.findSessionsTotalDurationGroupByDate(
            startDateTime,
            startDateTime.plusDays(5)
        )

        // Assert
        val day1DateStr = with(startDateTime) { "$year-$monthValue-$dayOfMonth" }
        val day2DateStr = with(startDateTime.plusDays(1)) { "$year-$monthValue-$dayOfMonth" }
        val day3DateStr = with(startDateTime.plusDays(2)) { "$year-$monthValue-$dayOfMonth" }
        for (sessionDateTotalDuration in resultsSessionTagTotalDuration) {
            val objDateStr = with(sessionDateTotalDuration) { "$year-$month-$dayOfMonth" }
            when (objDateStr) {
                day1DateStr -> assertEquals(60, sessionDateTotalDuration.totalDuration)
                day2DateStr -> assertEquals(60, sessionDateTotalDuration.totalDuration)
                day3DateStr -> assertEquals(60, sessionDateTotalDuration.totalDuration)
                else -> fail("Unknown session date total duration found!")
            }
        }
    }
}
