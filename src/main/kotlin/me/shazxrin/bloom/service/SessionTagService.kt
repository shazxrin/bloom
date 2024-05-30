package me.shazxrin.bloom.service

import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.model.session.SessionTag
import me.shazxrin.bloom.repository.SessionTagRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

interface SessionTagService {
    fun createTag(name: String, color: String)

    fun deleteTag(id: String)

    fun updateTag(id: String, name: String?, color: String?)

    fun getAllTags(): Iterable<SessionTag>
}

@Service
class MainSessionTagService @Autowired constructor(
    private val sessionTagRepository: SessionTagRepository
) : SessionTagService {
    override fun createTag(name: String, color: String) {
        val newTag = SessionTag(
            name = name,
            color = color,
        )

        sessionTagRepository.save(newTag)
    }

    override fun deleteTag(id: String) {
        if (!sessionTagRepository.existsById(id)) {
            throw NotFoundException("Tag does not exist!")
        }

        sessionTagRepository.deleteById(id)
    }

    override fun updateTag(id: String, name: String?, color: String?) {
        val existingCategory = sessionTagRepository.findByIdOrNull(id)
            ?: throw NotFoundException("Tag does not exist!")

        val updatedExistingCategory = SessionTag(
            id = id,
            name = name ?: existingCategory.name,
            color = color ?: existingCategory.color
        )

        sessionTagRepository.save(updatedExistingCategory)
    }

    override fun getAllTags(): Iterable<SessionTag> {
        return sessionTagRepository.findAll()
    }
}
