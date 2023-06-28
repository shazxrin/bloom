package me.shazxrin.bloom.server.repository

import kotlinx.coroutines.flow.Flow
import me.shazxrin.bloom.server.model.Task
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import java.time.LocalDateTime

interface TaskRepository : CoroutineCrudRepository<Task, String> {
    suspend fun findByEndTimeIsNull(): Task?

    suspend fun existsByEndTimeIsNull(): Boolean

    suspend fun findTasksByCategoryIdOrderByStartTime(categoryId: String): Flow<Task>

    suspend fun findTasksByStartTimeBetween(fromLocalDateTime: LocalDateTime, endLocalDateTime: LocalDateTime): Flow<Task>
}
