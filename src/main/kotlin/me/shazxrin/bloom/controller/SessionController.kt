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
    fun getAllSessions(
        @RequestParam(required = true) page: Int,
        @RequestParam(required = false) tagId: String?
    ): PagedListDto<ListSessionDto> {
        val pagedList =
            if (tagId != null) sessionService.getAllSessionsByCategoryId(tagId, page)
            else sessionService.getAllSessions(page)

        return pagedList.map {
            ListSessionDto(
                it.id ?: "",
                it.name,
                ListSessionTagDto(
                    it.tag.id ?: "",
                    it.tag.name,
                    it.tag.color,
                ),
                it.totalDuration,
                it.startDateTime,
                it.endDateTime
            )
        }
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun postAddSession(@Valid @RequestBody addSessionDto: AddSessionDto) {
        with(addSessionDto) {
            sessionService.createSession(name, tagId, totalDuration, startDateTime, endDateTime)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}")
    fun putUpdateSession(@PathVariable id: String, @Valid @RequestBody updateSessionDto: UpdateSessionDto) {
        with(updateSessionDto) {
            sessionService.updateSession(id, name, tagId, totalDuration, startDateTime, endDateTime)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}")
    fun deleteSession(@PathVariable id: String) {
        sessionService.deleteSession(id)
    }
}
