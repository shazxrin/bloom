package me.shazxrin.bloom.server.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.core.mapping.event.ValidatingMongoEventListener
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean

@Configuration
class MongoConfiguration {
    @Bean
    fun validatingMongoEventListener(factory: LocalValidatorFactoryBean): ValidatingMongoEventListener {
        return ValidatingMongoEventListener(factory)
    }
}