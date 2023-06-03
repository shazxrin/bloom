package me.sadmeowkins.bloom.advice

import me.sadmeowkins.bloom.exception.ExistsException
import me.sadmeowkins.bloom.exception.NotFoundException
import me.sadmeowkins.bloom.exception.StateException
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException

@RestControllerAdvice
class RestControllerExceptionAdvice {
    @ExceptionHandler
    fun handleNotFoundException(ex: me.sadmeowkins.bloom.exception.NotFoundException) {
        throw ResponseStatusException(HttpStatus.NOT_FOUND, ex.message)
    }

    @ExceptionHandler
    fun handleExistException(ex: me.sadmeowkins.bloom.exception.ExistsException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, ex.message)
    }

    @ExceptionHandler
    fun handleStateException(ex: me.sadmeowkins.bloom.exception.StateException) {
        throw ResponseStatusException(HttpStatus.BAD_REQUEST, ex.message)
    }
}