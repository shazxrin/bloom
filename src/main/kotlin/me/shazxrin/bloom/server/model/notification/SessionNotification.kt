package me.shazxrin.bloom.server.model.notification

import jakarta.persistence.*
import me.shazxrin.bloom.server.model.BaseEntity
import me.shazxrin.bloom.server.model.session.Session
import org.springframework.lang.NonNull

@Table(name = "session_notification")
@Entity
class SessionNotification(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String?,

    @OneToOne(optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    @NonNull
    var session: Session
) : BaseEntity()
