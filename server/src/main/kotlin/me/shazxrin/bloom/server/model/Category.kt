package me.shazxrin.bloom.server.model

import jakarta.validation.constraints.NotNull
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Category(
    @Id
    val id: String = ObjectId.get().toString(),

    @field:NotNull
    val name: String,

    @field:NotNull
    val color: String
) : BaseEntity()