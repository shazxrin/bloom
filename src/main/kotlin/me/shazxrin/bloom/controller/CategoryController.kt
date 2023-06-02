package me.shazxrin.bloom.controller

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import me.shazxrin.bloom.dto.category.CreateCategoryDto
import me.shazxrin.bloom.dto.category.ListCategoryDto
import me.shazxrin.bloom.dto.category.UpdateCategoryDto
import me.shazxrin.bloom.service.CategoryService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/categories")
class CategoryController @Autowired constructor(private val categoryService: CategoryService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    suspend fun postCreateCategory(@RequestBody createCategoryDto: CreateCategoryDto) {
        with(createCategoryDto) {
            categoryService.createCategory(name, color)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{id}")
    suspend fun patchUpdateCategory(
        @PathVariable id: String,
        @RequestBody updateCategoryDto: UpdateCategoryDto
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
    suspend fun getAllCategories(): Flow<ListCategoryDto> {
        return categoryService.getAllCategories()
            .map {
                with(it) {
                    ListCategoryDto(id, name, color)
                }
            }
    }
}
