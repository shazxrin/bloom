package me.sadmeowkins.bloom.controller

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import me.sadmeowkins.bloom.dto.category.CreateCategoryDto
import me.sadmeowkins.bloom.dto.category.ListCategoryDto
import me.sadmeowkins.bloom.dto.category.UpdateCategoryDto
import me.sadmeowkins.bloom.service.CategoryService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/categories")
class CategoryController @Autowired constructor(private val categoryService: me.sadmeowkins.bloom.service.CategoryService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    suspend fun postCreateCategory(@RequestBody createCategoryDto: me.sadmeowkins.bloom.dto.category.CreateCategoryDto) {
        with(createCategoryDto) {
            categoryService.createCategory(name, color)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{id}")
    suspend fun patchUpdateCategory(
        @PathVariable id: String,
        @RequestBody updateCategoryDto: me.sadmeowkins.bloom.dto.category.UpdateCategoryDto
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
    suspend fun getAllCategories(): Flow<me.sadmeowkins.bloom.dto.category.ListCategoryDto> {
        return categoryService.getAllCategories()
            .map {
                with(it) {
                    me.sadmeowkins.bloom.dto.category.ListCategoryDto(id, name, color)
                }
            }
    }
}
