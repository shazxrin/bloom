package me.shazxrin.bloom.server.service

import me.shazxrin.bloom.server.exception.NotFoundException
import me.shazxrin.bloom.server.exception.StateException
import me.shazxrin.bloom.server.model.session.Session
import me.shazxrin.bloom.server.model.session.SessionStatus
import me.shazxrin.bloom.server.repository.SessionTagRepository
import me.shazxrin.bloom.server.repository.SessionRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.LocalDateTime

interface CurrentSessionService {
    fun createCurrentSession(name: String, tagId: String, totalDuration: Long)

    fun pauseCurrentSession()

    fun resumeCurrentSession()

    fun endCurrentSession()

    fun getCurrentSession(): Session?
}

@Service
class MainCurrentSessionService @Autowired constructor(
    private val sessionRepository: SessionRepository,
    private val sessionTagRepository: SessionTagRepository
) : CurrentSessionService {
    override fun createCurrentSession(name: String, tagId: String, totalDuration: Long) {
        if (sessionRepository.existsByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED))) {
            throw StateException("Current session already exists!")
        }

        val tag = sessionTagRepository.findByIdOrNull(tagId) ?:
            throw NotFoundException("Tag does not exist!")

        val newCurrentSession = Session(
            id = null,
            name = name,
            tag = tag,
            totalDuration = totalDuration,
            remainingDuration = totalDuration,
            status = SessionStatus.RUNNING,
            startDateTime = LocalDateTime.now(),
            endDateTime = null
        )

        sessionRepository.save(newCurrentSession)
    }

    override fun pauseCurrentSession() {
        val currentSession = sessionRepository.findByStatus(SessionStatus.RUNNING)
                ?: throw StateException("Current session does not exist or is already paused")

        val deltaDuration = Duration.between(currentSession.resumeDateTime, LocalDateTime.now()).toSeconds()
        currentSession.remainingDuration -= deltaDuration
        currentSession.usedDuration += deltaDuration
        currentSession.status = SessionStatus.PAUSED

        sessionRepository.save(currentSession)
    }

    override fun resumeCurrentSession() {
        val currentSession = sessionRepository.findByStatus(SessionStatus.PAUSED)
            ?: throw StateException("Current session does not exist or is already running")

        currentSession.resumeDateTime = LocalDateTime.now()
        currentSession.status = SessionStatus.RUNNING

        sessionRepository.save(currentSession)
    }

    override fun endCurrentSession() {
        val currentSession = sessionRepository.findByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED))
            ?: throw NotFoundException("Current task does not exist")

        currentSession.remainingDuration = 0
        // Update used duration if running only.
        // Paused session has updated used duration already.
        if (currentSession.status == SessionStatus.RUNNING) {
            val deltaDuration = Duration.between(currentSession.resumeDateTime, LocalDateTime.now()).toSeconds()
            currentSession.usedDuration += deltaDuration
        }
        currentSession.status = SessionStatus.COMPLETED

        sessionRepository.save(currentSession)
    }

    override fun getCurrentSession(): Session? {
        return sessionRepository.findByStatusIn(listOf(SessionStatus.RUNNING, SessionStatus.PAUSED))
    }
}
