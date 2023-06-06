package me.sadmeowkins.bloom.service

import me.sadmeowkins.bloom.exception.NotFoundException
import me.sadmeowkins.bloom.model.Category
import me.sadmeowkins.bloom.repository.CategoryRepository
import org.springframework.beans.factory.annotation.Autowired
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
        val existingCategory =
            categoryRepository.findById(id).orElseThrow { NotFoundException("Category does not exist!") }

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
