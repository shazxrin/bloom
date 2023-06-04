package me.sadmeowkins.bloom.controller

import jakarta.validation.Valid
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import me.sadmeowkins.bloom.dto.category.CreateCategoryDTO
import me.sadmeowkins.bloom.dto.category.ListCategoryDTO
import me.sadmeowkins.bloom.dto.category.UpdateCategoryDTO
import me.sadmeowkins.bloom.service.CategoryService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/categories")
class CategoryController @Autowired constructor(private val categoryService: CategoryService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    suspend fun postCreateCategory(@Valid @RequestBody createCategoryDto: CreateCategoryDTO) {
        with(createCategoryDto) {
            categoryService.createCategory(name, color)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{id}")
    suspend fun patchUpdateCategory(
        @PathVariable id: String,
        @Valid @RequestBody updateCategoryDto: UpdateCategoryDTO
    ) {
        with(updateCategoryDto) {
            categoryService.updateCategory(id, name, color)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}")
    suspend fun deleteCategory(@PathVariable id: String) {
        categoryService.deleteCategory(id)
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/all")
    suspend fun getAllCategories(): Flow<ListCategoryDTO> {
        return categoryService.getAllCategories()
            .map {
                with(it) {
                    ListCategoryDTO(id, name, color)
                }
            }
    }
}
