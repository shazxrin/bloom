package me.sadmeowkins.bloom.advice

import me.sadmeowkins.bloom.exception.NotFoundException
import me.sadmeowkins.bloom.exception.StateException
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class RestControllerExceptionHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler
    fun handleNotFoundException(ex: NotFoundException) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, ex.message)
    }

    @ExceptionHandler
    fun handleStateException(ex: StateException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, ex.message)
    }
}