package me.shazxrin.bloom.controller

import jakarta.validation.Valid
import me.shazxrin.bloom.dto.session.current.CreateCurrentSessionDto
import me.shazxrin.bloom.dto.session.current.CurrentSessionDto
import me.shazxrin.bloom.dto.session.current.CurrentSessionTagDto
import me.shazxrin.bloom.service.CurrentSessionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/session/current")
class CurrentSessionController @Autowired constructor(private val sessionService: CurrentSessionService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    fun postCreateCurrentTask(@Valid @RequestBody createCurrentSessionDto: CreateCurrentSessionDto) {
        with(createCurrentSessionDto) {
            sessionService.createCurrentSession(name, tagId, totalDuration)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/pause")
    fun postPauseCurrentTask() {
        sessionService.pauseCurrentSession()
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/resume")
    fun postResumeCurrentTask() {
        sessionService.resumeCurrentSession()
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/end")
    fun postEndCurrentTask() {
        sessionService.endCurrentSession()
    }

    @GetMapping
    fun getCurrentTask(): ResponseEntity<CurrentSessionDto?> {
        val currentTask = sessionService.getCurrentSession()

        return if (currentTask == null) {
            ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build()
        } else {
            val currentSessionDto = with(currentTask) {
                CurrentSessionDto(
                    name,
                    CurrentSessionTagDto(
                        tag.name,
                        tag.color
                    ),
                    totalDuration,
                    remainingDuration,
                    status,
                    startDateTime,
                    resumeDateTime
                )
            }

            ResponseEntity
                .status(HttpStatus.OK)
                .body(currentSessionDto)
        }
    }
}
