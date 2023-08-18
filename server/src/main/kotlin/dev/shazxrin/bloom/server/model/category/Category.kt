package dev.shazxrin.bloom.server.model.category

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import dev.shazxrin.bloom.server.model.BaseEntity

@Table(name = "categories")
@Entity
data class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String?,

    val name: String,

    val color: String
) : BaseEntity()
