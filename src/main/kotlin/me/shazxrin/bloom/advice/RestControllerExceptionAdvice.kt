package me.shazxrin.bloom.advice

import me.shazxrin.bloom.exception.ExistsException
import me.shazxrin.bloom.exception.NotFoundException
import me.shazxrin.bloom.exception.StateException
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException

@RestControllerAdvice
class RestControllerExceptionAdvice {
    @ExceptionHandler
    fun handleNotFoundException(ex: NotFoundException) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, ex.message)
    }

    @ExceptionHandler
    fun handleExistException(ex: ExistsException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, ex.message)
    }

    @ExceptionHandler
    fun handleStateException(ex: StateException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, ex.message)
    }
}