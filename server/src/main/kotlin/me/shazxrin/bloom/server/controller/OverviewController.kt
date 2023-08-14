package me.shazxrin.bloom.server.controller

import me.shazxrin.bloom.server.dto.overview.CategoryTotalDurationDto
import me.shazxrin.bloom.server.dto.overview.DateTotalDurationDto
import me.shazxrin.bloom.server.dto.overview.WeeklyOverviewDto
import me.shazxrin.bloom.server.service.OverviewService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/overviews")
class OverviewController @Autowired constructor(private val overviewService: OverviewService) {
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/daily")
    fun getDailyOverview(@RequestParam("date") date: LocalDate?): List<CategoryTotalDurationDto> {
        return overviewService.getDailyOverview(date ?: LocalDate.now()).map {
            CategoryTotalDurationDto(it.category.id ?: "", it.totalDuration)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/weekly")
    fun getWeeklyOverview(@RequestParam("date") date: LocalDate?): WeeklyOverviewDto {
        val weeklyOverview = overviewService.getWeeklyOverview(date ?: LocalDate.now())

        return WeeklyOverviewDto(
            categories = weeklyOverview.categories.map {
                CategoryTotalDurationDto(
                    it.category.id ?: "",
                    it.totalDuration
                )
            },
            dates = weeklyOverview.dates.map {
                DateTotalDurationDto(
                    LocalDate.of(it.year, it.month, it.dayOfMonth),
                    it.totalDuration
                )
            }
        )
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/yearly")
    fun getYearlyOverview(): List<DateTotalDurationDto> {
        return overviewService.getYearlyOverview().map {
            DateTotalDurationDto(LocalDate.of(it.year, it.month, it.dayOfMonth), it.totalDuration)
        }
    }
}
