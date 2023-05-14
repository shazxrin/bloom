package me.shazxrin.bloom.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document
data class Task(
    @Id val id: String = ObjectId.get().toString(),
    val name: String,
    val categoryId: String,
    val duration: Long,
    val remainingDuration: Long,
    val isPaused: Boolean,
    val startTime: LocalDateTime,
    val lastStartTime: LocalDateTime,
    val endTime: LocalDateTime?,
) : Entity(LocalDateTime.now(), LocalDateTime.now())
