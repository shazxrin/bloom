package me.shazxrin.bloom.server.controller

import jakarta.validation.Valid
import me.shazxrin.bloom.server.dto.common.PagedListDto
import me.shazxrin.bloom.server.dto.common.map
import me.shazxrin.bloom.server.dto.task.*
import me.shazxrin.bloom.server.service.TaskService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/tasks")
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
    fun getAllTasks(
        @RequestParam(required = true) page: Int,
        @RequestParam(required = false) categoryId: String?
    ): PagedListDto<ListTaskDto> {
        val pagedList =
            if (categoryId != null) taskService.getAllTasksByCategoryId(categoryId, page) else taskService.getAllTasks(page)

        return pagedList.map {
            ListTaskDto(it.id ?: "", it.name, it.categoryId, it.duration, it.startTime, it.endTime)
        }
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun postAddTask(@Valid @RequestBody addTaskDto: AddTaskDto) {
        with(addTaskDto) {
            taskService.addTask(name, categoryId, duration, startTime, endTime)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{id}")
    fun patchUpdateTask(@PathVariable id: String, @Valid @RequestBody updateTaskDto: UpdateTaskDto) {
        with(updateTaskDto) {
            taskService.updateTask(id, name, categoryId, duration, startTime, endTime)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: String) {
        taskService.deleteTask(id)
    }
}
