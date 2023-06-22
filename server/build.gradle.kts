import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.1.0"
    id("io.spring.dependency-management") version "1.1.0"
    id("org.springdoc.openapi-gradle-plugin") version "1.6.0"
    id("org.openapi.generator") version "6.6.0"
    kotlin("jvm") version "1.8.21"
    kotlin("plugin.spring") version "1.8.21"
    kotlin("plugin.jpa") version "1.8.21"
}

group = "me.shazxrin.bloom"
version = "1.0-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    implementation("org.springframework.boot:spring-boot-starter-validation")

    implementation("org.springframework.boot:spring-boot-starter-actuator")

    developmentOnly("org.springframework.boot:spring-boot-devtools")

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("org.postgresql:postgresql")

    developmentOnly("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

openApiGenerate {
    generatorName.set("typescript-axios")
    inputSpec.set("${buildDir}/openapi.json")
    outputDir.set("${projectDir}/../webapp/src/api")
    configOptions.set(mapOf(
        "useSingleRequestParameter" to "true"
    ))
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
