package me.shazxrin.bloom.server.model.session

import jakarta.persistence.*
import me.shazxrin.bloom.server.model.BaseEntity
import java.time.LocalDateTime

@Table(name = "sessions")
@Entity
class Session(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    var name: String,

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "tag_id", nullable = false)
    var tag: SessionTag,

    @Enumerated(EnumType.STRING)
    var status: SessionStatus,

    var totalDuration: Long,

    var remainingDuration: Long,

    var usedDuration: Long = 0,

    var startDateTime: LocalDateTime,

    var resumeDateTime: LocalDateTime = startDateTime,

    var endDateTime: LocalDateTime? = null,
) : BaseEntity()
