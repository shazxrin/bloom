package me.shazxrin.bloom.repository

import me.shazxrin.bloom.model.session.Session
import me.shazxrin.bloom.model.session.SessionStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.CrudRepository

interface SessionRepository : CrudRepository<Session, String> {
    fun findByIdNotNullOrderByStartDateTimeDesc(pageable: Pageable): Page<Session>

    fun findByTagIdOrderByStartDateTimeDesc(tagId: String, pageable: Pageable): Page<Session>

    fun findByStatus(status: SessionStatus): Session?

    fun findByStatusIn(status: List<SessionStatus>): Session?

    fun existsByStatusIn(statuses: List<SessionStatus>): Boolean
}
