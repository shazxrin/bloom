package me.shazxrin.bloom.repository

import me.shazxrin.bloom.model.Category
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository

interface CategoryRepository : CoroutineCrudRepository<Category, String>