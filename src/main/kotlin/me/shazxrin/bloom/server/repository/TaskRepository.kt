package me.shazxrin.bloom.server.repository

import kotlinx.coroutines.flow.Flow
import me.shazxrin.bloom.server.model.Task
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import java.time.LocalDateTime

interface TaskRepository : CoroutineCrudRepository<Task, String> {
    suspend fun findTasksByIdNotNullOrderByStartTimeDesc(pageable: Pageable): Flow<Task>

    suspend fun countTasksByIdNotNull(): Int

    suspend fun findTasksByCategoryIdOrderByStartTimeDesc(categoryId: String, pageable: Pageable): Flow<Task>

    suspend fun countTasksByCategoryId(categoryId: String): Int

    suspend fun findByEndTimeIsNull(): Task?

    suspend fun existsByEndTimeIsNull(): Boolean

    suspend fun findTasksByStartTimeBetween(fromLocalDateTime: LocalDateTime, endLocalDateTime: LocalDateTime): Flow<Task>
}
