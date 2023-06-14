package me.shazxrin.bloom.server.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Table(name = "tasks")
@Entity
data class Task(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String?,

    val name: String,

    @ManyToOne
    val category: Category,

    val duration: Long,

    val remainingDuration: Long,

    val isPaused: Boolean,

    val startTime: LocalDateTime,

    val lastStartTime: LocalDateTime,

    val endTime: LocalDateTime?,
) : BaseEntity()
