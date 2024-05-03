import com.github.gradle.node.pnpm.task.PnpmTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("com.github.ben-manes.versions") version "0.51.0"
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.spring") version "1.9.22"
    kotlin("plugin.jpa") version "1.9.22"
    id("org.springframework.boot") version "3.2.2"
    id("org.springdoc.openapi-gradle-plugin") version "1.8.0"
    id("io.spring.dependency-management") version "1.1.4"
    id("com.github.node-gradle.node") version "7.0.2"
}

group = "me.shazxrin"
version = "1.8"

java {
    sourceCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

node {
    nodeProjectDir.set(file("${projectDir}/client"))
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")

    implementation("org.springframework.boot:spring-boot-starter-amqp")

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    runtimeOnly("org.postgresql:postgresql")

    developmentOnly("org.springframework.boot:spring-boot-devtools")

    implementation("org.springframework.boot:spring-boot-starter-actuator")

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0")

    testImplementation("org.springframework.boot:spring-boot-starter-test")

    testImplementation("org.springframework.amqp:spring-rabbit-test")
}

tasks.register<Delete>("cleanClient") {
    delete(file("${projectDir}/build/resources/main/public"))
    delete(file("${projectDir}/build/resources/main/templates"))
    delete(file("${projectDir}/webapp/dist"))
}

tasks.register<PnpmTask>("buildClient") {
    dependsOn(tasks.named("cleanClient"))
    pnpmCommand.set(listOf("run", "build"))
}

tasks.register<Copy>("bundleClient") {
    dependsOn(tasks.named("buildClient"))
    from(file("${projectDir}/client/dist"))
    into(file("${projectDir}/build/resources/main/public"))
    rename("index.html", "../templates/index.html")
}

tasks.register<PnpmTask>("generateClientApi") {
    dependsOn(tasks.named("generateOpenApiDocs"))

    pnpmCommand.set(listOf("run", "generateClientApi"))
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "21"
    }
}

tasks.named("forkedSpringBootRun").configure {
    dependsOn(tasks.named("pnpmSetup"))
    doNotTrackState("Workaround!")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
