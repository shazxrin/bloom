package me.shazxrin.bloom

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BloomApplication

fun main(args: Array<String>) {
    runApplication<BloomApplication>(*args)
}
