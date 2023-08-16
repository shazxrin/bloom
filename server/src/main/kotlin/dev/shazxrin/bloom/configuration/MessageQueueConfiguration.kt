package dev.shazxrin.bloom.configuration

import org.springframework.amqp.core.Queue
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MessageQueueConfiguration {
    @Value("\${bloom.mq.queue}")
    lateinit var queueName: String

    @Bean
    fun queue(): Queue {
        return Queue(queueName, true)
    }
}
