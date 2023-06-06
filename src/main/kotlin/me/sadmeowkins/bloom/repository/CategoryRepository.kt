package me.sadmeowkins.bloom.repository

import me.sadmeowkins.bloom.model.Category
import org.springframework.data.repository.CrudRepository

interface CategoryRepository : CrudRepository<Category, String>