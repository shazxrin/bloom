package me.shazxrin.bloom.server.controller

import jakarta.validation.Valid
import me.shazxrin.bloom.server.dto.category.CreateCategoryDto
import me.shazxrin.bloom.server.dto.category.ListCategoryDto
import me.shazxrin.bloom.server.dto.category.UpdateCategoryDto
import me.shazxrin.bloom.server.service.CategoryService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/categories")
class CategoryController @Autowired constructor(private val categoryService: CategoryService) {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun postCreateCategory(@Valid @RequestBody createCategoryDto: CreateCategoryDto) {
        with(createCategoryDto) {
            categoryService.createCategory(name, color)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{id}")
    fun patchUpdateCategory(
        @PathVariable id: String,
        @Valid @RequestBody updateCategoryDto: UpdateCategoryDto
    ) {
        with(updateCategoryDto) {
            categoryService.updateCategory(id, name, color)
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}")
    fun deleteCategory(@PathVariable id: String) {
        categoryService.deleteCategory(id)
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/all")
    fun getAllCategories(): Iterable<ListCategoryDto> {
        return categoryService.getAllCategories()
            .map {
                with(it) {
                    ListCategoryDto(id ?: "", name, color)
                }
            }
    }
}
