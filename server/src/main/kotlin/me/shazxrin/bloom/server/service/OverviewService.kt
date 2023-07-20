package me.shazxrin.bloom.server.service

import me.shazxrin.bloom.server.model.CategoryTotalDuration
import me.shazxrin.bloom.server.model.DateTotalDuration
import me.shazxrin.bloom.server.repository.OverviewRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

interface OverviewService {
    fun getDailyOverview(): Iterable<CategoryTotalDuration>

    fun getYearlyOverview(): Iterable<DateTotalDuration>
}

@Service
class DefaultOverviewService @Autowired constructor(
    private val overviewRepository: OverviewRepository
) : OverviewService {
    override fun getDailyOverview(): Iterable<CategoryTotalDuration> {
        val fromLocalDateTime = LocalDateTime.of(LocalDate.now(), LocalTime.MIN)
        val toLocalDateTime = LocalDateTime.of(LocalDate.now(), LocalTime.MAX)

        return overviewRepository.findTasksGroupByCategoryId(fromLocalDateTime, toLocalDateTime)
    }

    override fun getYearlyOverview(): Iterable<DateTotalDuration> {
        val fromLocalDateTime = LocalDateTime.of(
            LocalDate.now().withDayOfYear(1).withMonth(1),
            LocalTime.MIN
        )
        val toLocalDateTime = LocalDateTime.of(
            LocalDate.now().withDayOfMonth(31).withMonth(12),
            LocalTime.MAX
        )

        return overviewRepository.findTasksGroupByDate(fromLocalDateTime, toLocalDateTime)
    }
}