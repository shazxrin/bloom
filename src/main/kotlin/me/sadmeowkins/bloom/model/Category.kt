package me.sadmeowkins.bloom.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Table(name = "categories")
@Entity
data class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String?,

    val name: String,

    val color: String
) : BaseEntity()