package me.shazxrin.bloom.model

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document
data class Category(
    @Id val id: String = ObjectId.get().toString(),
    val name: String,
    val color: String
)