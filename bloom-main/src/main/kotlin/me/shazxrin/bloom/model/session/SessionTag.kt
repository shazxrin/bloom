package me.shazxrin.bloom.model.session

import jakarta.persistence.*
import me.shazxrin.bloom.model.BaseEntity

@Table(name = "session_tags")
@Entity
class SessionTag(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: String? = null,

    var name: String,

    var color: String,

    @OneToMany(mappedBy = "tag", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var sessions: MutableList<Session>? = null
) : BaseEntity()
