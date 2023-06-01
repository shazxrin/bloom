package me.shazxrin.bloom

import me.shazxrin.bloom.controller.TaskController
import me.shazxrin.bloom.dto.task.CreateCurrentTaskDto
import me.shazxrin.bloom.service.TaskService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient

@WebFluxTest(TaskController::class)
class TaskControllerTest @Autowired constructor(val webTestClient: WebTestClient) {
    @MockBean lateinit var taskService: TaskService

    @Test
    fun `create current task`() {
        webTestClient
            .post()
            .uri("/api/task/current/create")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(CreateCurrentTaskDto("Testing Name", "1", 10))
            .exchange()
            .expectStatus().isCreated()
    }
}