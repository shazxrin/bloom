package dev.shazxrin.bloom.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class WebAppController {
    @RequestMapping(value = ["/", "/index.html", "/timer", "/history"])
    fun webAppRoutes(): String {
        return "index"
    }
}
