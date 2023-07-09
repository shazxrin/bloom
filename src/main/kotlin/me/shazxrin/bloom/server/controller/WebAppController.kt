package me.shazxrin.bloom.server.controller

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class WebAppController {
    @RequestMapping(value = ["/timer", "/history"])
    fun getIndex(): ResponseEntity<Unit> {
        return ResponseEntity
            .status(HttpStatus.TEMPORARY_REDIRECT)
            .header(HttpHeaders.LOCATION, "/")
            .build()
    }
}