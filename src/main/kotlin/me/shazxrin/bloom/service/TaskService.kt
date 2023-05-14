package me.shazxrin.bloom.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import me.shazxrin.bloom.dto.task.CreateCurrentTaskDto
import me.shazxrin.bloom.dto.task.CurrentTaskDto
import me.shazxrin.bloom.dto.task.ListTaskDto
import me.shazxrin.bloom.exception.ExistsException
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.exception.StateException
import me.shazxrin.bloom.model.Task
import me.shazxrin.bloom.repository.CategoryRepository
import me.shazxrin.bloom.repository.TaskRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

@Service
class TaskService @Autowired constructor(
    private val taskRepository: TaskRepository,
    private val categoryRepository: CategoryRepository
) {

    suspend fun createCurrentTask(createCurrentTaskDto: CreateCurrentTaskDto) {
        if (taskRepository.findByEndTimeIsNull() != null) {
            throw ExistsException("Current task already exists!")
        }

        if (!categoryRepository.existsById(createCurrentTaskDto.categoryId)) {
            throw NotFoundException("Category does not exist!")
        }

        val newCurrentTask = Task(
            name = createCurrentTaskDto.name,
            categoryId = createCurrentTaskDto.categoryId,
            duration = createCurrentTaskDto.duration,
            isPaused = false,
            remainingDuration = createCurrentTaskDto.duration,
            startTime = LocalDateTime.now(),
            lastStartTime = LocalDateTime.now(),
            endTime = null
        )

        taskRepository.save(newCurrentTask)
    }

    suspend fun pauseCurrentTask() {
        val currentTask = taskRepository.findByEndTimeIsNull()

        if (currentTask == null) {
            throw NotFoundException("Current task does not exist")
        }

        if (currentTask.isPaused) {
            throw StateException("Current task is already paused")
        }

        val pausedCurrentTask = currentTask.copy(
            isPaused = true,
            remainingDuration = currentTask.remainingDuration - Duration.between(currentTask.lastStartTime, LocalDateTime.now()).toSeconds()
        )

        taskRepository.save(pausedCurrentTask)
    }

    suspend fun resumeCurrentTask() {
        val currentTask = taskRepository.findByEndTimeIsNull()

        if (currentTask == null) {
            throw NotFoundException("Current task does not exist")
        }

        if (!currentTask.isPaused) {
            throw StateException("Current task is not paused")
        }

        val pausedCurrentTask = currentTask.copy(
            isPaused = false,
            lastStartTime = LocalDateTime.now()
        )

        taskRepository.save(pausedCurrentTask)
    }

    suspend fun endCurrentTask() {
        val currentTask = taskRepository.findByEndTimeIsNull()

        if (currentTask == null) {
            throw NotFoundException("Current task does not exist")
        }

        val completedCurrentTask = currentTask.copy(endTime = LocalDateTime.now())
        taskRepository.save(completedCurrentTask)
    }

    suspend fun getCurrentTask(): CurrentTaskDto? {
        val currentTask = taskRepository.findByEndTimeIsNull()

        return if (currentTask == null) {
            null
        } else {
            CurrentTaskDto(
                currentTask.name,
                currentTask.categoryId,
                currentTask.duration,
                currentTask.remainingDuration,
                currentTask.isPaused,
                currentTask.startTime,
                currentTask.lastStartTime
            )
        }
    }

    fun getAllTasks(): Flow<ListTaskDto> {
        return taskRepository.findAll()
            .map {
                ListTaskDto(
                    it.id,
                    it.name,
                    it.categoryId,
                    it.duration,
                    it.startTime,
                    it.endTime
                )
            }
    }
}