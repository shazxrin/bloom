package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.Category
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

interface CategoryRepository : CoroutineCrudRepository<Category, String>