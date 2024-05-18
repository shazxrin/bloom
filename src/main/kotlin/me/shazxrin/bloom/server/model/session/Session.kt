package me.shazxrin.bloom.server.model.session

import jakarta.persistence.*
import me.shazxrin.bloom.server.model.BaseEntity
import java.time.LocalDateTime

@Table(name = "sessions")
@Entity
class Session(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String?,

    var name: String,

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "tag_id", nullable = false)
    var tag: SessionTag,

    var totalDuration: Long,

    var remainingDuration: Long,

    @Enumerated(EnumType.STRING)
    var status: SessionStatus,

    var startDateTime: LocalDateTime,

    var endDateTime: LocalDateTime?,
) : BaseEntity()
