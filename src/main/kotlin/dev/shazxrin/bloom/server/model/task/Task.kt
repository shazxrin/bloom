package dev.shazxrin.bloom.server.model.task

import jakarta.persistence.*
import dev.shazxrin.bloom.server.model.BaseEntity
import java.time.LocalDateTime

@Table(name = "tasks")
@Entity
data class Task(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String?,

    val name: String,

    val categoryId: String,

    val duration: Long,

    val remainingDuration: Long,

    val isPaused: Boolean,

    val startTime: LocalDateTime,

    val lastStartTime: LocalDateTime,

    val endTime: LocalDateTime?,
) : BaseEntity()
