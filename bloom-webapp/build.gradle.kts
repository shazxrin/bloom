import com.github.gradle.node.pnpm.task.PnpmTask

plugins {
    id("com.github.node-gradle.node") version "7.0.2"
}

tasks.register<Copy>("copyOpenApiDoc") {
    dependsOn(":bloom-main:generateOpenApiDocs")

    from(file("${rootDir}/bloom-main/build/openapi.json"))
    into(file("${rootDir}/bloom-webapp/build"))
}

tasks.register<PnpmTask>("generateApiBindings") {
    dependsOn("copyOpenApiDoc")

    pnpmCommand.set(listOf("run", "generateApiBindings"))
}

tasks.register<PnpmTask>("dev") {
    pnpmCommand.set(listOf("run", "dev"))
}

tasks.register<PnpmTask>("build") {
    pnpmCommand.set(listOf("run", "build"))
}

tasks.register<PnpmTask>("start") {
    pnpmCommand.set(listOf("run", "start"))
}
