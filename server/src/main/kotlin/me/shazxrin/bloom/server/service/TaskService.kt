package me.shazxrin.bloom.server.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.toList
import me.shazxrin.bloom.server.exception.NotFoundException
import me.shazxrin.bloom.server.exception.StateException
import me.shazxrin.bloom.server.model.*
import me.shazxrin.bloom.server.repository.CategoryRepository
import me.shazxrin.bloom.server.repository.TaskRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.Duration
import java.time.LocalDateTime
import java.time.Month
import java.time.Year
import java.time.temporal.IsoFields
import java.time.temporal.TemporalAdjusters

interface TaskService {
    suspend fun createCurrentTask(name: String, categoryId: String, duration: Long)

    suspend fun pauseCurrentTask()

    suspend fun resumeCurrentTask()

    suspend fun endCurrentTask()

    suspend fun getCurrentTask(): Task?

    suspend fun getAllTasks(): Flow<Task>

    suspend fun getAllTasksByCategoryId(categoryId: String): Flow<Task>

    suspend fun getTasksOverviewDay(year: Int, month: Int, dayOfMonth: Int): TaskOverview

    suspend fun getTasksOverviewWeek(week: Int, year: Int): TaskOverview

    suspend fun getTasksOverviewMonth(month: Int, year: Int): TaskOverview

    suspend fun getTasksOverviewYear(year: Int): TaskOverview
}

@Service
class DefaultTaskService @Autowired constructor(
    private val taskRepository: TaskRepository,
    private val categoryRepository: CategoryRepository
) : TaskService {

    override suspend fun createCurrentTask(name: String, categoryId: String, duration: Long) {
        if (taskRepository.existsByEndTimeIsNull()) {
            throw StateException("Current task already exists!")
        }

        if (categoryRepository.existsById(categoryId)) {
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
                ?: throw NotFoundException("Current task does not exist")

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

    override suspend fun resumeCurrentTask() {
        val currentTask = taskRepository.findByEndTimeIsNull()
            ?: throw NotFoundException("Current task does not exist")

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
            ?: throw NotFoundException("Current task does not exist")

        val completedCurrentTask = currentTask.copy(endTime = LocalDateTime.now())
        taskRepository.save(completedCurrentTask)
    }

    override suspend fun getCurrentTask(): Task? {
        return taskRepository.findByEndTimeIsNull()
    }

    override suspend fun getAllTasks(): Flow<Task> {
        return taskRepository.findAll()
    }

    override suspend fun getAllTasksByCategoryId(categoryId: String): Flow<Task> {
        return taskRepository.findTasksByCategoryIdOrderByStartTime(categoryId)
    }

    override suspend fun getTasksOverviewDay(year: Int, month: Int, dayOfMonth: Int): TaskOverview {
        val fromLocalDateTime = LocalDateTime.of(
            year,
            month,
            dayOfMonth,
            0,
            0
        )
        val endLocalDateTime = LocalDateTime.of(
            year,
            month,
            dayOfMonth,
            23,
            59
        )

        val dailyTasks =
            taskRepository.findTasksByStartTimeBetween(fromLocalDateTime, endLocalDateTime).toList()
        val totalDuration =
            dailyTasks.sumOf { it.duration }
        val categoriesDuration = dailyTasks
                .groupBy({ it.categoryId }, { it.duration })
                .mapValues { it.value.sum() }

        return TaskOverview(
            dailyTasks,
            totalDuration,
            categoriesDuration
        )
    }

    override suspend fun getTasksOverviewWeek(week: Int, year: Int): TaskOverview {
        val fromLocalDateTime = LocalDateTime.now()
            .withYear(year)
            .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, week.toLong())
            .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
            .withHour(0)
            .withMinute(0)

        val endLocalDateTime = LocalDateTime.now()
            .withYear(year)
            .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, week.toLong())
            .with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
            .withHour(23)
            .withMinute(59)

        val dailyTasks =
            taskRepository.findTasksByStartTimeBetween(fromLocalDateTime, endLocalDateTime).toList()
        val totalDuration =
            dailyTasks.sumOf { it.duration }
        val categoriesDuration = dailyTasks
            .groupBy({ it.categoryId }, { it.duration })
            .mapValues { it.value.sum() }

        return TaskOverview(
            dailyTasks,
            totalDuration,
            categoriesDuration
        )
    }

    override suspend fun getTasksOverviewMonth(month: Int, year: Int): TaskOverview {
        val fromLocalDateTime = LocalDateTime.of(
            year,
            month,
            1,
            0,
            0
        )

        val endLocalDateTime = LocalDateTime.of(
            year,
            month,
            Month.of(month).length(Year.of(year).isLeap),
            0,
            0
        )

        val dailyTasks =
            taskRepository.findTasksByStartTimeBetween(fromLocalDateTime, endLocalDateTime).toList()
        val totalDuration =
            dailyTasks.sumOf { it.duration }
        val categoriesDuration = dailyTasks
            .groupBy({ it.categoryId }, { it.duration })
            .mapValues { it.value.sum() }

        return TaskOverview(
            dailyTasks,
            totalDuration,
            categoriesDuration
        )
    }

    override suspend fun getTasksOverviewYear(year: Int): TaskOverview {
        val fromLocalDateTime = LocalDateTime.of(
            year,
            1,
            1,
            0,
            0
        )

        val endLocalDateTime = LocalDateTime.of(
            year,
            12,
            Month.of(12).length(Year.of(year).isLeap),
            0,
            0
        )

        val dailyTasks =
            taskRepository.findTasksByStartTimeBetween(fromLocalDateTime, endLocalDateTime).toList()
        val totalDuration =
            dailyTasks.sumOf { it.duration }
        val categoriesDuration = dailyTasks
            .groupBy({ it.categoryId }, { it.duration })
            .mapValues { it.value.sum() }

        return TaskOverview(
            dailyTasks,
            totalDuration,
            categoriesDuration
        )
    }
}