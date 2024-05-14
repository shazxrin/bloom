package me.shazxrin.bloom.server.configuration

import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.resource.PathResourceResolver

@Configuration
class WebMvcConfiguration : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        // Add resource handler that handles routes not handled by REST controllers.
        // The resource handler handles routes used for frontend SPA.
        registry
            .addResourceHandler("/**")
            .addResourceLocations("classpath:/public/**")
            .resourceChain(true)
            .addResolver(object : PathResourceResolver() {
                override fun getResource(resourcePath: String, location: Resource): Resource {
                    // Return static resources
                    val requestedResource = location.createRelative(resourcePath)
                    if (requestedResource.exists() && requestedResource.isReadable) {
                        return requestedResource
                    }

                    // Return index page for SPA to handle
                    return ClassPathResource("/public/index.html")
                }
            })

    }
}
