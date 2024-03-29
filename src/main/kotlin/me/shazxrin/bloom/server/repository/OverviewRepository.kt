package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.overview.CategoryTotalDuration
import me.shazxrin.bloom.server.model.overview.DateTotalDuration
import me.shazxrin.bloom.server.model.task.Task
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime

interface OverviewRepository : CrudRepository<Task, String> {
    @Query("SELECT new me.shazxrin.bloom.server.model.overview.CategoryTotalDuration(c, sum(t.duration)) " +
            "FROM Task AS t " +
            "INNER JOIN Category AS c ON t.categoryId = c.id " +
            "WHERE t.startTime BETWEEN :from AND :to " +
            "GROUP BY c.id")
    fun findTasksGroupByCategoryId(
        @Param("from") fromLocalDateTime: LocalDateTime,
        @Param("to") toLocalDateTime: LocalDateTime
    ): Iterable<CategoryTotalDuration>

    @Query(
        "SELECT new me.shazxrin.bloom.server.model.overview.DateTotalDuration(EXTRACT(DAY FROM t.startTime), EXTRACT(MONTH FROM t.startTime), EXTRACT(YEAR FROM t.startTime), sum(t.duration)) " +
            "FROM Task AS t " +
            "WHERE t.startTime BETWEEN :from AND :to " +
            "GROUP BY EXTRACT(YEAR FROM t.startTime), EXTRACT(MONTH FROM t.startTime), EXTRACT(DAY FROM t.startTime)")
    fun findTasksGroupByDate(
        @Param("from") fromLocalDateTime: LocalDateTime,
        @Param("to") toLocalDateTime: LocalDateTime
    ): Iterable<DateTotalDuration>
}
