package me.shazxrin.bloom.controller

import jakarta.validation.Valid
import me.shazxrin.bloom.dto.paging.PagedListDto
import me.shazxrin.bloom.dto.paging.map
import me.shazxrin.bloom.dto.session.*
import me.shazxrin.bloom.service.SessionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/session")
class SessionController @Autowired constructor(private val sessionService: SessionService) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/all")
    fun getAllTasks(
        @RequestParam(required = true) page: Int,
        @RequestParam(required = false) tagId: String?
    ): PagedListDto<ListSessionDto> {
        val pagedList =
            if (tagId != null) sessionService.getAllSessionsByCategoryId(tagId, page)
            else sessionService.getAllSessions(page)

        return pagedList.map {
            ListSessionDto(it.id ?: "", it.name, it.tag.id ?: "", it.totalDuration, it.startDateTime, it.endDateTime)
        }
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun postAddTask(@Valid @RequestBody addSessionDto: AddSessionDto) {
        with(addSessionDto) {
            sessionService.createSession(name, tagId, totalDuration, startTime, endTime)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{id}")
    fun patchUpdateTask(@PathVariable id: String, @Valid @RequestBody updateSessionDto: UpdateSessionDto) {
        with(updateSessionDto) {
            sessionService.updateSession(id, name, tagId, totalDuration, startDateTime, endDateTime)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: String) {
        sessionService.deleteSession(id)
    }
}
