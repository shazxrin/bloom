package me.shazxrin.bloom.server.service

import me.shazxrin.bloom.server.exception.NotFoundException
import me.shazxrin.bloom.server.exception.StateException
import me.shazxrin.bloom.server.model.Task
import me.shazxrin.bloom.server.repository.CategoryRepository
import me.shazxrin.bloom.server.repository.TaskRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull

interface TaskService {
    fun createCurrentTask(name: String, categoryId: String, duration: Long)

    fun pauseCurrentTask()

    fun resumeCurrentTask()

    fun endCurrentTask()

    fun getCurrentTask(): Task?

    fun getAllTasks(): Iterable<Task>
}

@Service
class DefaultTaskService @Autowired constructor(
    private val taskRepository: TaskRepository,
    private val categoryRepository: CategoryRepository
) : TaskService {

    override fun createCurrentTask(name: String, categoryId: String, duration: Long) {
        if (taskRepository.existsByEndTimeIsNull()) {
            throw StateException("Current task already exists!")
        }

        if (!categoryRepository.existsById(categoryId)) {
            throw NotFoundException("Category does not exist!")
        }

        val newCurrentTask = Task(
            id = null,
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

    override fun pauseCurrentTask() {
        val currentTask =
            taskRepository.findByEndTimeIsNull().orElseThrow { NotFoundException("Current task does not exist") }

        if (currentTask.isPaused) {
            throw StateException("Current task is already paused")
        }

        val pausedCurrentTask = currentTask.copy(
            isPaused = true,
            remainingDuration = currentTask.remainingDuration - Duration.between(
                currentTask.lastStartTime,
                LocalDateTime.now()
            ).toSeconds()
        )

        taskRepository.save(pausedCurrentTask)
    }

    override fun resumeCurrentTask() {
        val currentTask =
            taskRepository.findByEndTimeIsNull().orElseThrow { NotFoundException("Current task does not exist") }

        if (!currentTask.isPaused) {
            throw StateException("Current task is not paused")
        }

        val pausedCurrentTask = currentTask.copy(
            isPaused = false,
            lastStartTime = LocalDateTime.now()
        )

        taskRepository.save(pausedCurrentTask)
    }

    override fun endCurrentTask() {
        val currentTask =
            taskRepository.findByEndTimeIsNull().orElseThrow { NotFoundException("Current task does not exist") }

        val completedCurrentTask = currentTask.copy(endTime = LocalDateTime.now())
        taskRepository.save(completedCurrentTask)
    }

    override fun getCurrentTask(): Task? {
        return taskRepository.findByEndTimeIsNull().getOrNull()
    }

    override fun getAllTasks(): Iterable<Task> {
        return taskRepository.findAll()
    }
}