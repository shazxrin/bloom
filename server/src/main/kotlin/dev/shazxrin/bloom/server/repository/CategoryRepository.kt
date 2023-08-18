package dev.shazxrin.bloom.server.repository

import dev.shazxrin.bloom.server.model.category.Category
import org.springframework.data.repository.CrudRepository

interface CategoryRepository : CrudRepository<Category, String>