package me.shazxrin.bloom.server.service

import me.shazxrin.bloom.server.exception.NotFoundException
import me.shazxrin.bloom.server.exception.StateException
import me.shazxrin.bloom.server.model.*
import me.shazxrin.bloom.server.repository.CategoryRepository
import me.shazxrin.bloom.server.repository.TaskRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.Duration
import java.time.LocalDateTime
import java.time.Month
import java.time.Year
import java.time.temporal.IsoFields
import java.time.temporal.TemporalAdjusters

interface TaskService {
    fun createCurrentTask(name: String, categoryId: String, duration: Long)

    fun pauseCurrentTask()

    fun resumeCurrentTask()

    fun endCurrentTask()

    fun getCurrentTask(): Task?

    fun getAllTasks(): Iterable<Task>

    fun getAllTasksByCategoryId(categoryId: String): Iterable<Task>

    fun getTasksOverviewDay(year: Int, month: Int, dayOfMonth: Int): TaskOverview

    fun getTasksOverviewWeek(week: Int, year: Int): TaskOverview

    fun getTasksOverviewMonth(month: Int, year: Int): TaskOverview

    fun getTasksOverviewYear(year: Int): TaskOverview
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

        val category = categoryRepository.findByIdOrNull(categoryId)
            ?: throw NotFoundException("Category does not exist!")

        val newCurrentTask = Task(
            id = null,
            name = name,
            category = category,
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

    override fun resumeCurrentTask() {
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

    override fun endCurrentTask() {
        val currentTask = taskRepository.findByEndTimeIsNull()
            ?: throw NotFoundException("Current task does not exist")

        val completedCurrentTask = currentTask.copy(endTime = LocalDateTime.now())
        taskRepository.save(completedCurrentTask)
    }

    override fun getCurrentTask(): Task? {
        return taskRepository.findByEndTimeIsNull()
    }

    override fun getAllTasks(): Iterable<Task> {
        return taskRepository.findAll()
    }

    override fun getAllTasksByCategoryId(categoryId: String): Iterable<Task> {
        return taskRepository.findTasksByCategory_IdOrderByStartTime(categoryId)
    }

    override fun getTasksOverviewDay(year: Int, month: Int, dayOfMonth: Int): TaskOverview {
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
            taskRepository.findTasksByStartTimeBetween(fromLocalDateTime, endLocalDateTime)
        val totalDuration =
            dailyTasks.sumOf { it.duration }
        val categoriesDuration = dailyTasks
                .groupBy({ it.category }, { it.duration })
                .mapValues { it.value.sum() }

        return TaskOverview(
            dailyTasks,
            totalDuration,
            categoriesDuration
        )
    }

    override fun getTasksOverviewWeek(week: Int, year: Int): TaskOverview {
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
            taskRepository.findTasksByStartTimeBetween(fromLocalDateTime, endLocalDateTime)
        val totalDuration =
            dailyTasks.sumOf { it.duration }
        val categoriesDuration = dailyTasks
            .groupBy({ it.category }, { it.duration })
            .mapValues { it.value.sum() }

        return TaskOverview(
            dailyTasks,
            totalDuration,
            categoriesDuration
        )
    }

    override fun getTasksOverviewMonth(month: Int, year: Int): TaskOverview {
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
            taskRepository.findTasksByStartTimeBetween(fromLocalDateTime, endLocalDateTime)
        val totalDuration =
            dailyTasks.sumOf { it.duration }
        val categoriesDuration = dailyTasks
            .groupBy({ it.category }, { it.duration })
            .mapValues { it.value.sum() }

        return TaskOverview(
            dailyTasks,
            totalDuration,
            categoriesDuration
        )
    }

    override fun getTasksOverviewYear(year: Int): TaskOverview {
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
            taskRepository.findTasksByStartTimeBetween(fromLocalDateTime, endLocalDateTime)
        val totalDuration =
            dailyTasks.sumOf { it.duration }
        val categoriesDuration = dailyTasks
            .groupBy({ it.category }, { it.duration })
            .mapValues { it.value.sum() }

        return TaskOverview(
            dailyTasks,
            totalDuration,
            categoriesDuration
        )
    }
}