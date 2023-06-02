package me.shazxrin.bloom.service

import kotlinx.coroutines.flow.Flow
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.model.Category
import me.shazxrin.bloom.repository.CategoryRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

interface CategoryService {
    suspend fun createCategory(name: String, color: String)

    suspend fun deleteCategory(id: String)

    suspend fun updateCategory(id: String, name: String?, color: String?)

    fun getAllCategories(): Flow<Category>
}

@Service
class DefaultCategoryService @Autowired constructor(private val categoryRepository: CategoryRepository) :
    CategoryService {
    override suspend fun createCategory(name: String, color: String) {
        val newCategory = Category(
            name = name,
            color = color
        )

        categoryRepository.save(newCategory)
    }

    override suspend fun deleteCategory(id: String) {
        if (!categoryRepository.existsById(id)) {
            throw NotFoundException("Category does not exist!")
        }

        categoryRepository.deleteById(id)
    }

    override suspend fun updateCategory(id: String, name: String?, color: String?) {
        val existingCategory = categoryRepository.findById(id)

        if (existingCategory == null) {
            throw NotFoundException("Category does not exist!")
        }

        val updatedExistingCategory = existingCategory.copy(
            name = name ?: existingCategory.name,
            color = color ?: existingCategory.color
        )

        categoryRepository.save(updatedExistingCategory)
    }

    override fun getAllCategories(): Flow<Category> {
        return categoryRepository.findAll()
    }
}
