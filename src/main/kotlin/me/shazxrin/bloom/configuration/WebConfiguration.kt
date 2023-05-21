package me.shazxrin.bloom.configuration

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer

@Configuration
@ConditionalOnProperty(prefix = "server", name = ["disable-cors"], havingValue = "true")
class WebConfiguration : WebFluxConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**").allowedMethods("*")
    }
}