import com.github.gradle.node.pnpm.task.PnpmTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("com.github.ben-manes.versions") version "0.51.0"
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.spring") version "1.9.22"
    kotlin("plugin.jpa") version "1.9.22"
    id("org.springframework.boot") version "3.2.5"
    id("org.springdoc.openapi-gradle-plugin") version "1.8.0"
    id("io.spring.dependency-management") version "1.1.5"
    id("com.github.node-gradle.node") version "7.0.2"
}

group = "me.shazxrin"
version = "2.0"

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
    implementation("org.springframework.boot:spring-boot-starter-amqp")

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.liquibase:liquibase-core")
    runtimeOnly("org.postgresql:postgresql:42.7.3")

    implementation("org.springframework.boot:spring-boot-starter-validation")

    implementation("org.springframework.boot:spring-boot-starter-actuator")

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.17.1")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    developmentOnly("org.springframework.boot:spring-boot-devtools")

    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(module = "mockito-core")
    }
    testImplementation("org.junit.jupiter:junit-jupiter-api")
    testRuntimeOnly("com.h2database:h2")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine")
    testImplementation("com.ninja-squad:springmockk:4.0.2")
}

tasks.register<Delete>("cleanClient") {
    delete(file("${projectDir}/build/resources/main/public"))
    delete(file("${projectDir}/build/resources/main/templates"))
    delete(file("${projectDir}/client/dist"))
}

tasks.register<PnpmTask>("buildClient") {
    dependsOn(tasks.named("cleanClient"))
    pnpmCommand.set(listOf("run", "build"))
}

tasks.register<Copy>("bundleClient") {
    dependsOn(tasks.named("buildClient"))
    from(file("${projectDir}/client/build/client"))
    into(file("${projectDir}/build/resources/main/public"))
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

tasks.forkedSpringBootRun.configure {
    dependsOn(tasks.named("pnpmSetup"))
    doNotTrackState("Workaround!")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
