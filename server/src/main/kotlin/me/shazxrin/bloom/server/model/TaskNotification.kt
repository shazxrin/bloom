package me.shazxrin.bloom.server.model

import com.mongodb.lang.NonNull
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
class TaskNotification(
    @Id
    val id: String = ObjectId.get().toString(),

    @field:NonNull
    val taskId: String
) : BaseEntity()
