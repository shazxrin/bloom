package me.shazxrin.bloom.model

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime

abstract class BaseEntity(
    @CreatedDate
    open var createdDateTime: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate
    open var modifiedDateTime: LocalDateTime = LocalDateTime.now()
)
