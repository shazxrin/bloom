package me.shazxrin.bloom.server.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.lang.NonNull

@Table(name = "task_notification")
@Entity
class TaskNotification(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String?,

    @NonNull
    val taskId: String
) : BaseEntity()
