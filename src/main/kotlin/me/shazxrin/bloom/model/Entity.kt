package me.shazxrin.bloom.model

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime

abstract class Entity(
    @CreatedDate open var createdDateTime: LocalDateTime,
    @LastModifiedDate open var modifiedDateTime: LocalDateTime
)