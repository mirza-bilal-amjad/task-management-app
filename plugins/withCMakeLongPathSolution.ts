import { ConfigPlugin, withAppBuildGradle } from "expo/config-plugins"

export const withCMakeLongPathSolution: ConfigPlugin = (config) => {
  if (process.platform === "darwin") return config
  return withAppBuildGradle(config, async (config) => {
    let buildGradle = config.modResults.contents

    // Define the externalNativeBuild block
    const externalNativeBuildBlock = `
        externalNativeBuild {
            cmake {
                arguments "-DCMAKE_MAKE_PROGRAM=C:\\\\ninja\\\\ninja.exe", "-DCMAKE_OBJECT_PATH_MAX=1024"
            }
        }
`

    // Regex to match the defaultConfig block
    const defaultConfigRegex = /(defaultConfig\s*{[^}]*})/s

    if (buildGradle.match(defaultConfigRegex)) {
      // Insert the externalNativeBuild block before the closing brace of defaultConfig
      buildGradle = buildGradle.replace(defaultConfigRegex, (match) =>
        match.replace(/}$/, `${externalNativeBuildBlock}    }`),
      )
    } else {
      // If defaultConfig block is not found, append it inside the android block
      const androidRegex = /(android\s*{[^}]*})/s
      if (buildGradle.match(androidRegex)) {
        buildGradle = buildGradle.replace(
          androidRegex,
          `$1\n    defaultConfig {\n${externalNativeBuildBlock}\n    }`,
        )
      } else {
        throw new Error("Could not find android block in build.gradle")
      }
    }

    config.modResults.contents = buildGradle
    return config
  })
}
