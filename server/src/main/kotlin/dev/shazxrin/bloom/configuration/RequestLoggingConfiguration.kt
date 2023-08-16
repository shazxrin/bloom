package dev.shazxrin.bloom.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.filter.CommonsRequestLoggingFilter

@Configuration
class RequestLoggingConfiguration {
    @Bean
    fun commonsRequestLoggingFilter(): CommonsRequestLoggingFilter {
        val filter = CommonsRequestLoggingFilter()
        filter.setIncludePayload(true)
        filter.setIncludeQueryString(true)
        filter.setIncludeHeaders(false)
        filter.setMaxPayloadLength(10_000)
        return filter
    }
}