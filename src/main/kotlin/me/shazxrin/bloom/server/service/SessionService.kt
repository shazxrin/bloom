package me.shazxrin.bloom.server.service

import me.shazxrin.bloom.server.exception.NotFoundException
import me.shazxrin.bloom.server.model.paging.PagedList
import me.shazxrin.bloom.server.model.session.Session
import me.shazxrin.bloom.server.model.session.SessionStatus
import me.shazxrin.bloom.server.repository.SessionTagRepository
import me.shazxrin.bloom.server.repository.SessionRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDateTime

interface SessionService {
    fun getAllSessions(page: Int): PagedList<Session>

    fun getAllSessionsByCategoryId(tagId: String, page: Int): PagedList<Session>

    fun createSession(name: String, tagId: String, totalDuration: Long, startTime: LocalDateTime, endTime: LocalDateTime)

    fun deleteSession(id: String)

    fun updateSession(id: String, name: String?, tagId: String?, totalDuration: Long?, startTime: LocalDateTime?, endTime: LocalDateTime?)
}

@Service
class MainSessionService @Autowired constructor(
    private val sessionRepository: SessionRepository,
    private val sessionTagRepository: SessionTagRepository
) : SessionService {
    override fun getAllSessions(page: Int): PagedList<Session> {
        val pageable = PageRequest.of(page, 10)

        val items = sessionRepository
            .findByIdNotNullOrderByStartDateTimeDesc(pageable)

        return PagedList(
            items.number,
            items.totalPages,
            items.content
        )
    }

    override fun getAllSessionsByCategoryId(tagId: String, page: Int): PagedList<Session> {
        val pageable = PageRequest.of(page, 10)

        val items = sessionRepository
            .findByTagIdOrderByStartDateTimeDesc(tagId, pageable)

        return PagedList(
            items.number,
            items.totalPages,
            items.content
        )
    }

    override fun createSession(
        name: String,
        tagId: String,
        totalDuration: Long,
        startTime: LocalDateTime,
        endTime: LocalDateTime
    ) {
        val tag = sessionTagRepository.findByIdOrNull(tagId) ?:
            throw NotFoundException("Tag does not exists")

        val newSession = Session(
            name = name,
            tag = tag,
            status = SessionStatus.COMPLETED,
            totalDuration = totalDuration,
            remainingDuration = 0,
            usedDuration = totalDuration,
            startDateTime = startTime,
            endDateTime = endTime
        )

        sessionRepository.save(newSession)
    }

    override fun deleteSession(id: String) {
        sessionRepository.deleteById(id)
    }

    override fun updateSession(
        id: String,
        name: String?,
        tagId: String?,
        totalDuration: Long?,
        startTime: LocalDateTime?,
        endTime: LocalDateTime?
    ) {
        val updateSession = sessionRepository.findByIdOrNull(id)
            ?: throw NotFoundException("Session does not exists")

        updateSession.name = name ?: updateSession.name
        updateSession.totalDuration = totalDuration ?: updateSession.totalDuration
        updateSession.usedDuration = totalDuration ?: updateSession.totalDuration
        updateSession.startDateTime = startTime ?: updateSession.startDateTime
        updateSession.endDateTime = endTime ?: updateSession.endDateTime

        if (tagId != null) {
            val tag = sessionTagRepository.findByIdOrNull(tagId)
                ?: throw NotFoundException("Tag does not exists")

            updateSession.tag = tag
        }

        sessionRepository.save(updateSession)
    }
}
