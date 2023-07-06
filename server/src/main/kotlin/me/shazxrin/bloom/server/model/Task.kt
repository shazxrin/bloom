package me.shazxrin.bloom.server.model

import jakarta.validation.constraints.NotNull
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document
data class Task(
    @Id
    val id: String = ObjectId.get().toString(),

    @field:NotNull
    val name: String,

    @field:NotNull
    val categoryId: String,

    @field:NotNull
    val duration: Long,

    @field:NotNull
    val remainingDuration: Long,

    @field:NotNull
    val isPaused: Boolean,

    @field:NotNull
    val startTime: LocalDateTime,

    @field:NotNull
    val lastStartTime: LocalDateTime,

    val endTime: LocalDateTime?
) : BaseEntity()
