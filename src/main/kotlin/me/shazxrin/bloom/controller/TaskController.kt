package me.shazxrin.bloom.controller

import kotlinx.coroutines.flow.Flow
import me.shazxrin.bloom.dto.task.*
import me.shazxrin.bloom.exception.ExistsException
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.exception.StateException
import me.shazxrin.bloom.service.TaskService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/task")
class TaskController @Autowired constructor(private val taskService: TaskService) {

    @PostMapping("/current/create")
    suspend fun postCreateCurrentTask(@RequestBody createCurrentTaskDto: CreateCurrentTaskDto): ResponseEntity<Unit> {
        try {
            taskService.createCurrentTask(createCurrentTaskDto)
        } catch (ex: Exception) {
            when (ex) {
                is NotFoundException, is ExistsException -> throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    ex.message
                )

                else -> throw ex
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).build()
    }

    @PostMapping("/current/pause")
    suspend fun postPauseCurrentTask(): ResponseEntity<Unit> {
        try {
            taskService.pauseCurrentTask()
        } catch (ex: Exception) {
            when (ex) {
                is NotFoundException, is StateException -> throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    ex.message
                )

                else -> throw ex
            }
        }

        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @PostMapping("/current/resume")
    suspend fun postResumeCurrentTask(): ResponseEntity<Unit> {
        try {
            taskService.resumeCurrentTask()
        } catch (ex: Exception) {
            when (ex) {
                is NotFoundException, is StateException -> throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    ex.message
                )

                else -> throw ex
            }
        }

        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @PostMapping("/current/end")
    suspend fun postEndCurrentTask(): ResponseEntity<Unit> {
        try {
            taskService.endCurrentTask()
        } catch (ex: NotFoundException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, ex.message)
        }

        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @GetMapping("/current")
    suspend fun getCurrentTask(): ResponseEntity<CurrentTaskDto?> {
        val currentTaskDto = taskService.getCurrentTask()

        return if (currentTaskDto == null) {
            ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build()
        } else {
            ResponseEntity
                .status(HttpStatus.OK)
                .body(currentTaskDto)
        }

    }

    @GetMapping("/all")
    suspend fun getAllTasks(): Flow<ListTaskDto> {
        return taskService.getAllTasks()
    }
}