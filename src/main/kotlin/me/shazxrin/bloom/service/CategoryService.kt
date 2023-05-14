package me.shazxrin.bloom.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import me.shazxrin.bloom.dto.category.UpdateCategoryDto
import me.shazxrin.bloom.dto.category.CreateCategoryDto
import me.shazxrin.bloom.dto.category.ListCategoryDto
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.model.Category
import me.shazxrin.bloom.repository.CategoryRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class CategoryService @Autowired constructor(private val categoryRepository: CategoryRepository) {
    suspend fun createCategory(createCategoryDto: CreateCategoryDto) {
        val newCategory = Category(
            name = createCategoryDto.name,
            color = createCategoryDto.color
        )

        categoryRepository.save(newCategory)
    }

    suspend fun deleteCategory(id: String) {
        if (!categoryRepository.existsById(id)) {
            throw NotFoundException("Category does not exist!")
        }

        categoryRepository.deleteById(id)
    }

    suspend fun updateCategory(id: String, updateCategoryDto: UpdateCategoryDto) {
        val existingCategory = categoryRepository.findById(id)

        if (existingCategory == null) {
            throw NotFoundException("Category does not exist!")
        }

        val updatedExistingCategory = existingCategory.copy(
            name = updateCategoryDto.name ?: existingCategory.name,
            color = updateCategoryDto.color ?: existingCategory.color
        )

        categoryRepository.save(updatedExistingCategory)
    }

    fun getAllCategories(): Flow<ListCategoryDto> {
        return categoryRepository.findAll().map { ListCategoryDto(it.id, it.name, it.color) }
    }
}
