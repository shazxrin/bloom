package me.shazxrin.bloom.configuration

import org.springframework.amqp.core.Queue
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MessageQueueConfiguration @Autowired constructor(
  @Value("\${bloom.notification-queue-name}") private val notificationQueueName: String
) {
    @Bean
    fun queue(): Queue {
        return Queue(notificationQueueName, true)
    }

    @Bean
    fun messageConverter(): MessageConverter {
        return Jackson2JsonMessageConverter()
    }
}
