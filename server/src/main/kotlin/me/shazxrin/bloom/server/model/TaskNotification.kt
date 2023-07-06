package me.shazxrin.bloom.server.model

import com.mongodb.lang.NonNull
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

class TaskNotification(
    @Id
    val id: String = ObjectId.get().toString(),

    @NonNull
    val taskId: String
) : BaseEntity()
