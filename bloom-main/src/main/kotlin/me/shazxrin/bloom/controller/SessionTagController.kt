package me.shazxrin.bloom.controller

import jakarta.validation.Valid
import me.shazxrin.bloom.dto.session.tag.CreateTagDto
import me.shazxrin.bloom.dto.session.tag.ListTagDto
import me.shazxrin.bloom.dto.session.tag.UpdateTagDto
import me.shazxrin.bloom.service.SessionTagService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/session/tag")
class SessionTagController @Autowired constructor(private val sessionTagService: SessionTagService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun postCreateTag(@Valid @RequestBody createTagDto: CreateTagDto) {
        with(createTagDto) {
            sessionTagService.createTag(name, color)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}")
    fun putUpdateTag(
        @PathVariable id: String,
        @Valid @RequestBody updateTagDto: UpdateTagDto
    ) {
        with(updateTagDto) {
            sessionTagService.updateTag(id, name, color)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}")
    fun deleteTag(@PathVariable id: String) {
        sessionTagService.deleteTag(id)
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/all")
    fun getAllTags(): List<ListTagDto> {
        return sessionTagService.getAllTags()
            .map {
                with(it) {
                    ListTagDto(id ?: "", name, color)
                }
            }
    }
}
