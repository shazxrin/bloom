package me.sadmeowkins.bloom.service

import kotlinx.coroutines.flow.Flow
import me.sadmeowkins.bloom.exception.ExistsException
import me.sadmeowkins.bloom.exception.NotFoundException
import me.sadmeowkins.bloom.exception.StateException
import me.sadmeowkins.bloom.model.Task
import me.sadmeowkins.bloom.repository.CategoryRepository
import me.sadmeowkins.bloom.repository.TaskRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.LocalDateTime

interface TaskService {
    suspend fun createCurrentTask(name: String, categoryId: String, duration: Long)

    suspend fun pauseCurrentTask()

    suspend fun resumeCurrentTask()

    suspend fun endCurrentTask()

    suspend fun getCurrentTask(): me.sadmeowkins.bloom.model.Task?

    fun getAllTasks(): Flow<me.sadmeowkins.bloom.model.Task>
}

@Service
class DefaultTaskService @Autowired constructor(
    private val taskRepository: me.sadmeowkins.bloom.repository.TaskRepository,
    private val categoryRepository: me.sadmeowkins.bloom.repository.CategoryRepository
) : me.sadmeowkins.bloom.service.TaskService {

    override suspend fun createCurrentTask(name: String, categoryId: String, duration: Long) {
        if (taskRepository.findByEndTimeIsNull() != null) {
            throw me.sadmeowkins.bloom.exception.ExistsException("Current task already exists!")
        }

        if (!categoryRepository.existsById(categoryId)) {
            throw me.sadmeowkins.bloom.exception.NotFoundException("Category does not exist!")
        }

        val newCurrentTask = me.sadmeowkins.bloom.model.Task(
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
            throw me.sadmeowkins.bloom.exception.NotFoundException("Current task does not exist")
        }

        if (currentTask.isPaused) {
            throw me.sadmeowkins.bloom.exception.StateException("Current task is already paused")
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
            throw me.sadmeowkins.bloom.exception.NotFoundException("Current task does not exist")
        }

        if (!currentTask.isPaused) {
            throw me.sadmeowkins.bloom.exception.StateException("Current task is not paused")
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
            throw me.sadmeowkins.bloom.exception.NotFoundException("Current task does not exist")
        }

        val completedCurrentTask = currentTask.copy(endTime = LocalDateTime.now())
        taskRepository.save(completedCurrentTask)
    }

    override suspend fun getCurrentTask(): me.sadmeowkins.bloom.model.Task? {
        return taskRepository.findByEndTimeIsNull()
    }

    override fun getAllTasks(): Flow<me.sadmeowkins.bloom.model.Task> {
        return taskRepository.findAll()
    }
}