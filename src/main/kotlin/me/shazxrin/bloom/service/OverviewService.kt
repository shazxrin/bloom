package me.shazxrin.bloom.service

import me.shazxrin.bloom.model.overview.*
import me.shazxrin.bloom.repository.OverviewRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

interface OverviewService {
    fun getDailyOverview(date: LocalDate): DailyOverview

    fun getWeeklyOverview(date: LocalDate): WeeklyOverview

    fun getYearlyOverview(year: Int): YearlyOverview
}

@Service
class MainOverviewService @Autowired constructor(
    private val overviewRepository: OverviewRepository
) : OverviewService {
    override fun getDailyOverview(date: LocalDate): DailyOverview {
        val fromDateTime = LocalDateTime.of(date, LocalTime.MIN)
        val toDateTime = LocalDateTime.of(date, LocalTime.MAX)

        return DailyOverview(
            sessionTagTotalDurations = overviewRepository.findSessionsTotalDurationGroupByTag(fromDateTime, toDateTime)
        )
    }

    override fun getWeeklyOverview(date: LocalDate): WeeklyOverview {
        val firstDayOfWeekDiff = date.dayOfWeek.value - DayOfWeek.MONDAY.value
        val lastDayOfWeekDiff = DayOfWeek.SUNDAY.value - date.dayOfWeek.value

        val fromDateTime = LocalDateTime.of(
            date.minusDays(firstDayOfWeekDiff.toLong()),
            LocalTime.MIN
        )
        val toDateTime = LocalDateTime.of(
            date.plusDays(lastDayOfWeekDiff.toLong()),
            LocalTime.MAX
        )

        return WeeklyOverview(
            sessionTagTotalDurations = overviewRepository.findSessionsTotalDurationGroupByTag(fromDateTime, toDateTime),
            sessionDateTotalDurations = overviewRepository.findSessionsTotalDurationGroupByDate(fromDateTime, toDateTime)
        )
    }

    override fun getYearlyOverview(year: Int): YearlyOverview {
        val fromDateTime = LocalDateTime.of(
            LocalDate.now().withMonth(1).withDayOfYear(1).withYear(year),
            LocalTime.MIN
        )
        val toDateTime = LocalDateTime.of(
            LocalDate.now().withMonth(12).withDayOfMonth(31).withYear(year),
            LocalTime.MAX
        )

        return YearlyOverview(
            sessionDateTotalDurations = overviewRepository.findSessionsTotalDurationGroupByDate(fromDateTime, toDateTime)
        )
    }
}
