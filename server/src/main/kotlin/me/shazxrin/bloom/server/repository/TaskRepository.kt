package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.Task
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.CrudRepository

interface TaskRepository : CrudRepository<Task, String> {
    fun findTasksByIdNotNullOrderByStartTimeDesc(pageable: Pageable): Page<Task>

    fun findTasksByCategoryIdOrderByStartTimeDesc(categoryId: String, pageable: Pageable): Page<Task>

    fun findByEndTimeIsNull(): Task?

    fun existsByEndTimeIsNull(): Boolean
}
