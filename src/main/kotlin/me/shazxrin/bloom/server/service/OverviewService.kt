package me.shazxrin.bloom.server.service

import me.shazxrin.bloom.server.model.overview.*
import me.shazxrin.bloom.server.repository.OverviewRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

interface OverviewService {
    fun getDailyOverview(date: LocalDate): DailyOverview

    fun getWeeklyOverview(date: LocalDate): WeeklyOverview

    fun getYearlyOverview(): YearlyOverview
}

@Service
class DefaultOverviewService @Autowired constructor(
    private val overviewRepository: OverviewRepository
) : OverviewService {
    override fun getDailyOverview(date: LocalDate): DailyOverview {
        val fromLocalDateTime = LocalDateTime.of(date, LocalTime.MIN)
        val toLocalDateTime = LocalDateTime.of(date, LocalTime.MAX)

        return DailyOverview(
            categories = overviewRepository.findTasksGroupByCategoryId(fromLocalDateTime, toLocalDateTime)
        )
    }

    override fun getWeeklyOverview(date: LocalDate): WeeklyOverview {
        val firstDayOfWeekDiff = date.dayOfWeek.value - DayOfWeek.MONDAY.value
        val lastDayOfWeekDiff = DayOfWeek.SUNDAY.value - date.dayOfWeek.value

        val fromLocalDateTime = LocalDateTime.of(
            date.minusDays(firstDayOfWeekDiff.toLong()),
            LocalTime.MIN
        )
        val toLocalDateTime = LocalDateTime.of(
            date.plusDays(lastDayOfWeekDiff.toLong()),
            LocalTime.MAX
        )

        return WeeklyOverview(
            categories = overviewRepository.findTasksGroupByCategoryId(fromLocalDateTime, toLocalDateTime),
            dates = overviewRepository.findTasksGroupByDate(fromLocalDateTime, toLocalDateTime)
        )
    }

    override fun getYearlyOverview(): YearlyOverview {
        val fromLocalDateTime = LocalDateTime.of(
            LocalDate.now().withMonth(1).withDayOfYear(1),
            LocalTime.MIN
        )
        val toLocalDateTime = LocalDateTime.of(
            LocalDate.now().withMonth(12).withDayOfMonth(31),
            LocalTime.MAX
        )

        return YearlyOverview(
            dates = overviewRepository.findTasksGroupByDate(fromLocalDateTime, toLocalDateTime)
        )
    }
}