package me.shazxrin.bloom.controller

import kotlinx.coroutines.flow.Flow
import me.shazxrin.bloom.dto.category.CreateCategoryDto
import me.shazxrin.bloom.dto.category.ListCategoryDto
import me.shazxrin.bloom.dto.category.UpdateCategoryDto
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.service.CategoryService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/category")
class CategoryController @Autowired constructor(private val categoryService: CategoryService) {

    @PostMapping
    suspend fun postCreateCategory(@RequestBody createCategoryDto: CreateCategoryDto): ResponseEntity<Unit> {
        categoryService.createCategory(createCategoryDto)

        return ResponseEntity.status(HttpStatus.CREATED).build()
    }

    @PatchMapping("/{id}")
    suspend fun patchUpdateCategory(@PathVariable id: String, @RequestBody updateCategoryDto: UpdateCategoryDto): ResponseEntity<Unit> {
        try {
            categoryService.updateCategory(id, updateCategoryDto)
        } catch (e: NotFoundException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }

        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @DeleteMapping("/{id}")
    suspend fun deleteCategory(@PathVariable id: String): ResponseEntity<Unit> {
        try {
            categoryService.deleteCategory(id)
        } catch (e: NotFoundException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }

        return ResponseEntity.status(HttpStatus.OK).build()
    }

    @GetMapping("/all")
    suspend fun getAllCategories(): Flow<ListCategoryDto> {
        return categoryService.getAllCategories()
    }
}
