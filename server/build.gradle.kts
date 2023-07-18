import com.github.gradle.node.npm.task.NpmTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
    id("org.springdoc.openapi-gradle-plugin") version "1.6.0"
    id("com.github.node-gradle.node") version "5.0.0"
    kotlin("jvm") version "1.8.21"
    kotlin("plugin.spring") version "1.8.21"
    kotlin("plugin.jpa") version "1.8.21"
}

group = "me.shazxrin"
version = "1.2-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
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

    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0")

    testImplementation("org.springframework.boot:spring-boot-starter-test")

    testImplementation("org.springframework.amqp:spring-rabbit-test")
}

tasks.register<Delete>("cleanWebapp") {
    delete(file("${projectDir}/src/main/resources/public"))
    delete(file("${projectDir}/src/main/resources/templates"))
    delete(file("${projectDir}/../webapp/dist"))
}

tasks.register<NpmTask>("buildWebapp") {
    dependsOn(tasks.named("cleanWebapp"))
    workingDir.set(file("${projectDir}/../webapp"))
    npmCommand.set(listOf("run", "build"))
}

tasks.register<Copy>("bundleWebapp") {
    dependsOn(tasks.named("buildWebapp"))
    from(file("${projectDir}/../webapp/dist"))
    into(file("${projectDir}/src/main/resources/public"))
    rename("index.html", "../templates/index.html")
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
