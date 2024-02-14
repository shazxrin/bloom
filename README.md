<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/docs/banner_dark.webp" />
  <img alt="" src="/docs/banner_light.webp" />
</picture>

<p align="center">
  <i>Personal time tracking web application</i>
</p>

## Screenshots

#### Dashboard
![Dashboard](/docs/ss_1.jpeg)

#### Timer
![Timer](/docs/ss_2.jpeg)

## Setting up

### Frontend

```bash
cd ./webapp

# Setup project
pnpm install

# Run development server
pnpm run dev
```

### Backend

```bash
# Setup project
gradle build

# Run development server
gradle bootRun
```

## Building

From the project directory, run the following command to build the container image:
```bash
# Build container image
gradle bundleWebapp bootBuildImage
```

> [!IMPORTANT]
> Remember to always bundle the web application before building the image.
