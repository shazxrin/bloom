package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.overview.SessionTagTotalDuration
import me.shazxrin.bloom.server.model.overview.SessionDateTotalDuration
import me.shazxrin.bloom.server.model.session.Session
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime

interface OverviewRepository : Repository<Session, String> {
    @Query(
        """
        SELECT new me.shazxrin.bloom.server.model.overview.SessionTagTotalDuration(t, sum(s.totalDuration))
        FROM Session AS s
        INNER JOIN SessionTag AS t ON t.id = s.tag.id
        WHERE s.startDateTime BETWEEN :from AND :to
        GROUP BY t.id
    """
    )
    fun findSessionsTotalDurationGroupByTag(
        @Param("from") fromDateTime: LocalDateTime,
        @Param("to") toDateTime: LocalDateTime
    ): List<SessionTagTotalDuration>

    @Query(
        """
        SELECT new me.shazxrin.bloom.server.model.overview.SessionDateTotalDuration(
            EXTRACT(DAY FROM s.startDateTime),
            EXTRACT(MONTH FROM s.startDateTime),
            EXTRACT(YEAR FROM s.startDateTime),
            sum(s.totalDuration)
        )
        FROM Session AS s
        WHERE s.startDateTime BETWEEN :from AND :to
        GROUP BY EXTRACT(YEAR FROM s.startDateTime), EXTRACT(MONTH FROM s.startDateTime), EXTRACT(DAY FROM s.startDateTime)
    """
    )
    fun findSessionsTotalDurationGroupByDate(
        @Param("from") fromDateTime: LocalDateTime,
        @Param("to") toDateTime: LocalDateTime
    ): List<SessionDateTotalDuration>
}
