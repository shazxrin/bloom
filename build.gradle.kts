import com.github.gradle.node.npm.task.NpmTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springdoc.openapi.gradle.plugin.OpenApiGeneratorTask

plugins {
    id("org.springframework.boot") version "3.0.6"
    id("io.spring.dependency-management") version "1.1.0"
    id("org.springdoc.openapi-gradle-plugin") version "1.6.0"
    id("org.openapi.generator") version "6.6.0"
    id("com.github.node-gradle.node") version "5.0.0"
    kotlin("jvm") version "1.7.22"
    kotlin("plugin.spring") version "1.7.22"
}

group = "me.shazxrin"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")

    implementation("org.springframework.boot:spring-boot-starter-actuator")

    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    developmentOnly("org.springframework.boot:spring-boot-devtools")

    developmentOnly("org.springdoc:springdoc-openapi-starter-webflux-ui:2.1.0")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
}

openApiGenerate {
    generatorName.set("typescript-axios")
    inputSpec.set("${buildDir}/openapi.json")
    outputDir.set("${projectDir}/webapp/src/api")
    configOptions.set(mapOf(
        "useSingleRequestParameter" to "true"
    ))
}

tasks.openApiGenerate {
    dependsOn(tasks.withType<OpenApiGeneratorTask>())
}

tasks.register<NpmTask>("buildWebapp") {
    workingDir.set(file("${projectDir}/webapp"))
    npmCommand.set(listOf("run", "build"))
}

tasks.register<Copy>("bundleWebapp") {
    dependsOn(tasks.named("removeWebapp"), tasks.named("buildWebapp"))
    from(file("${projectDir}/webapp/dist"))
    into(file("${projectDir}/src/main/resources/public"))
}

tasks.register<Delete>("removeWebapp") {
    delete(file("${projectDir}/src/main/resources/public"))
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
