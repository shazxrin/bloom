package dev.shazxrin.bloom.repository

import dev.shazxrin.bloom.model.category.Category
import org.springframework.data.repository.CrudRepository

interface CategoryRepository : CrudRepository<Category, String>