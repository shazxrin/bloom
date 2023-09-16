package me.shazxrin.bloom.server.repository

import me.shazxrin.bloom.server.model.category.Category
import org.springframework.data.repository.CrudRepository

interface CategoryRepository : CrudRepository<Category, String>