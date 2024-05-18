package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.session.SessionTag
import org.springframework.data.repository.CrudRepository

interface SessionTagRepository : CrudRepository<SessionTag, String>
