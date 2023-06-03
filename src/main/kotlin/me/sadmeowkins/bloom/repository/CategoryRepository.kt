package me.sadmeowkins.bloom.repository

import me.sadmeowkins.bloom.model.Category
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository

interface CategoryRepository : CoroutineCrudRepository<Category, String>