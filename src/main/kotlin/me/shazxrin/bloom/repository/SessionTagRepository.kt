package me.shazxrin.bloom.repository

import me.shazxrin.bloom.model.session.SessionTag
import org.springframework.data.repository.CrudRepository

interface SessionTagRepository : CrudRepository<SessionTag, String>
