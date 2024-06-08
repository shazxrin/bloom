package me.shazxrin.bloom.controller

import me.shazxrin.bloom.dto.overview.*
import me.shazxrin.bloom.service.OverviewService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/overview")
class OverviewController @Autowired constructor(private val overviewService: OverviewService) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/daily")
    fun getDailyOverview(@RequestParam("date") date: LocalDate?): DailyOverviewDto {
        val dailyOverview = overviewService.getDailyOverview(date ?: LocalDate.now())

        return DailyOverviewDto(
            dailyOverview.sessionTagTotalDurations.map {
                SessionTagTotalDurationDto(
                    SessionTagTotalDurationSessionTagDto(it.tag.id ?: "", it.tag.name, it.tag.color),
                    it.totalDuration
                )
            }
        )
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/weekly")
    fun getWeeklyOverview(@RequestParam("date") date: LocalDate?): WeeklyOverviewDto {
        val weeklyOverview = overviewService.getWeeklyOverview(date ?: LocalDate.now())

        return WeeklyOverviewDto(
            sessionTagTotalDurations = weeklyOverview.sessionTagTotalDurations.map {
                SessionTagTotalDurationDto(
                    SessionTagTotalDurationSessionTagDto(it.tag.id ?: "", it.tag.name, it.tag.color),
                    it.totalDuration
                )
            },
            sessionDateTotalDurations = weeklyOverview.sessionDateTotalDurations.map {
                SessionDateTotalDurationDto(
                    LocalDate.of(it.year, it.month, it.dayOfMonth),
                    it.totalDuration
                )
            }
        )
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/yearly")
    fun getYearlyOverview(): YearlyOverviewDto {
        val yearlyOverview = overviewService.getYearlyOverview()

        return YearlyOverviewDto(
            sessionDateTotalDurations = yearlyOverview.sessionDateTotalDurations.map {
                SessionDateTotalDurationDto(
                    LocalDate.of(it.year, it.month, it.dayOfMonth),
                    it.totalDuration
                )
            }
        )
    }
}
