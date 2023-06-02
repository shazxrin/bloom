package me.shazxrin.bloom.service

import kotlinx.coroutines.flow.Flow
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

interface TaskService {
    suspend fun createCurrentTask(name: String, categoryId: String, duration: Long)

    suspend fun pauseCurrentTask()

    suspend fun resumeCurrentTask()

    suspend fun endCurrentTask()

    suspend fun getCurrentTask(): Task?

    fun getAllTasks(): Flow<Task>
}

@Service
class DefaultTaskService @Autowired constructor(
    private val taskRepository: TaskRepository,
    private val categoryRepository: CategoryRepository
) : TaskService {

    override suspend fun createCurrentTask(name: String, categoryId: String, duration: Long) {
        if (taskRepository.findByEndTimeIsNull() != null) {
            throw ExistsException("Current task already exists!")
        }

        if (!categoryRepository.existsById(categoryId)) {
            throw NotFoundException("Category does not exist!")
        }

        val newCurrentTask = Task(
            name = name,
            categoryId = categoryId,
            duration = duration,
            isPaused = false,
            remainingDuration = duration,
            startTime = LocalDateTime.now(),
            lastStartTime = LocalDateTime.now(),
            endTime = null
        )

        taskRepository.save(newCurrentTask)
    }

    override suspend fun pauseCurrentTask() {
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

    override suspend fun resumeCurrentTask() {
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

    override suspend fun endCurrentTask() {
        val currentTask = taskRepository.findByEndTimeIsNull()

        if (currentTask == null) {
            throw NotFoundException("Current task does not exist")
        }

        val completedCurrentTask = currentTask.copy(endTime = LocalDateTime.now())
        taskRepository.save(completedCurrentTask)
    }

    override suspend fun getCurrentTask(): Task? {
        return taskRepository.findByEndTimeIsNull()
    }

    override fun getAllTasks(): Flow<Task> {
        return taskRepository.findAll()
    }
}