package me.shazxrin.bloom.server.controller

import jakarta.validation.Valid
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
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
@RequestMapping("/api/tasks")
class TaskController @Autowired constructor(private val taskService: TaskService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/current/create")
    suspend fun postCreateCurrentTask(@Valid @RequestBody createCurrentTaskDto: CreateCurrentTaskDto) {
        with(createCurrentTaskDto) {
            taskService.createCurrentTask(name, categoryId, duration)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/current/pause")
    suspend fun postPauseCurrentTask() {
        taskService.pauseCurrentTask()
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/current/resume")
    suspend fun postResumeCurrentTask() {
        taskService.resumeCurrentTask()
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/current/end")
    suspend fun postEndCurrentTask() {
        taskService.endCurrentTask()
    }

    @GetMapping("/current")
    suspend fun getCurrentTask(): ResponseEntity<CurrentTaskDto?> {
        val currentTask = taskService.getCurrentTask()

        return if (currentTask == null) {
            ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build()
        } else {
            val currentTaskDto = with(currentTask) {
                CurrentTaskDto(
                    name,
                    categoryId,
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
    suspend fun getAllTasks(@RequestParam(required = false) categoryId: String?): Flow<ListTaskDto> {
        val tasks =
            if (categoryId != null) taskService.getAllTasksByCategoryId(categoryId) else taskService.getAllTasks()

        return tasks.map {
            ListTaskDto(it.id, it.name, it.categoryId, it.duration, it.startTime, it.endTime)
        }
    }
}