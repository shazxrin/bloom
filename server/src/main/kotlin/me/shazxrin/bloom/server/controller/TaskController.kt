package me.shazxrin.bloom.server.controller

import jakarta.validation.Valid
import me.shazxrin.bloom.server.service.TaskService
import me.shazxrin.bloom.server.dto.task.CreateCurrentTaskDto
import me.shazxrin.bloom.server.dto.task.CurrentTaskDto
import me.shazxrin.bloom.server.dto.task.ListTaskDto
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/tasks")
class TaskController @Autowired constructor(private val taskService: TaskService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/current/create")
    fun postCreateCurrentTask(@Valid @RequestBody createCurrentTaskDto: CreateCurrentTaskDto) {
        with(createCurrentTaskDto) {
            taskService.createCurrentTask(name, categoryId, duration)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/current/pause")
    fun postPauseCurrentTask() {
        taskService.pauseCurrentTask()
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/current/resume")
    fun postResumeCurrentTask() {
        taskService.resumeCurrentTask()
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/current/end")
    fun postEndCurrentTask() {
        taskService.endCurrentTask()
    }

    @GetMapping("/current")
    fun getCurrentTask(): ResponseEntity<CurrentTaskDto?> {
        val currentTask = taskService.getCurrentTask()

        return if (currentTask == null) {
            ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build()
        } else {
            val currentTaskDto = with(currentTask) {
                CurrentTaskDto(
                    name,
                    category.id ?: "",
                    duration,
                    remainingDuration,
                    isPaused,
                    startTime,
                    lastStartTime
                )
            }

            ResponseEntity
                .status(HttpStatus.OK)
                .body(currentTaskDto)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/all")
    fun getAllTasks(@RequestParam(required = false) categoryId: String?): Iterable<ListTaskDto> {
        val tasks =
            if (categoryId != null) taskService.getAllTasksByCategoryId(categoryId) else taskService.getAllTasks()

        return tasks.map {
            with(it) {
                ListTaskDto(id ?: "", name, category.id ?: "", duration, startTime, endTime)
            }
        }
    }
}