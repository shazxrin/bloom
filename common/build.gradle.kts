plugins {
    id("java")
    kotlin("jvm")
}

group = "me.shazxrin.bloom"
version = "1.0-SNAPSHOT"
dependencies {
    implementation(kotlin("stdlib-jdk8"))
}
repositories {
    mavenCentral()
}
kotlin {
    jvmToolchain(11)
}