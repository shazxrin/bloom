package me.sadmeowkins.bloom.controller

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import me.sadmeowkins.bloom.dto.task.*
import me.sadmeowkins.bloom.service.TaskService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/tasks")
class TaskController @Autowired constructor(private val taskService: TaskService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/current/create")
    suspend fun postCreateCurrentTask(@RequestBody createCurrentTaskDto: CreateCurrentTaskDto) {
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
    suspend fun getAllTasks(): Flow<ListTaskDto> {
        return taskService.getAllTasks().map {
            with(it) {
                ListTaskDto(id, name, categoryId, duration, startTime, endTime)
            }
        }
    }
}