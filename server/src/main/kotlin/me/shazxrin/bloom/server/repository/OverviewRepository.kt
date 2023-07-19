package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.CategoryTotalDuration
import me.shazxrin.bloom.server.model.Task
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime

interface OverviewRepository : CrudRepository<Task, String> {
    @Query("SELECT new me.shazxrin.bloom.server.model.CategoryTotalDuration(c, sum(t.duration)) " +
            "FROM Task AS t " +
            "INNER JOIN Category AS c ON t.categoryId = c.id " +
            "WHERE t.startTime BETWEEN :from AND :to " +
            "GROUP BY c.id")
    fun findTasksGroupByCategoryId(
        @Param("from") fromLocalDateTime: LocalDateTime,
        @Param("to") toLocalDateTime: LocalDateTime
    ): Iterable<CategoryTotalDuration>
}
