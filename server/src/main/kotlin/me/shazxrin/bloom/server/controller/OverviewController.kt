package me.shazxrin.bloom.server.controller

import me.shazxrin.bloom.server.dto.overview.CategoryTotalDurationDto
import me.shazxrin.bloom.server.dto.overview.DateTotalDurationDto
import me.shazxrin.bloom.server.dto.task.*
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
    fun getDailyOverview(): List<CategoryTotalDurationDto> {
        return overviewService.getDailyOverview().map {
            CategoryTotalDurationDto(it.category.id ?: "", it.totalDuration)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/yearly")
    fun getYearlyOverview(): List<DateTotalDurationDto> {
        return overviewService.getYearlyOverview().map {
            DateTotalDurationDto(LocalDate.of(it.year, it.month, it.dayOfMonth), it.totalDuration)
        }
    }
}
