package dev.shazxrin.bloom.server.service

import dev.shazxrin.bloom.server.exception.NotFoundException
import dev.shazxrin.bloom.server.model.category.Category
import dev.shazxrin.bloom.server.repository.CategoryRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

interface CategoryService {
    fun createCategory(name: String, color: String)

    fun deleteCategory(id: String)

    fun updateCategory(id: String, name: String?, color: String?)

    fun getAllCategories(): Iterable<Category>
}

@Service
class DefaultCategoryService @Autowired constructor(private val categoryRepository: CategoryRepository) :
    CategoryService {
    override fun createCategory(name: String, color: String) {
        val newCategory = Category(
            id = null,
            name = name,
            color = color
        )

        categoryRepository.save(newCategory)
    }

    override fun deleteCategory(id: String) {
        if (!categoryRepository.existsById(id)) {
            throw NotFoundException("Category does not exist!")
        }

        categoryRepository.deleteById(id)
    }

    override fun updateCategory(id: String, name: String?, color: String?) {
        val existingCategory = categoryRepository.findByIdOrNull(id)
            ?: throw NotFoundException("Category does not exist!")

        val updatedExistingCategory = existingCategory.copy(
            name = name ?: existingCategory.name,
            color = color ?: existingCategory.color
        )

        categoryRepository.save(updatedExistingCategory)
    }

    override fun getAllCategories(): Iterable<Category> {
        return categoryRepository.findAll()
    }
}