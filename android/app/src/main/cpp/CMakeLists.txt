cmake_minimum_required(VERSION 3.13)
project(WuzzNitroText)

set(CMAKE_CXX_STANDARD 20)

find_package(fbjni REQUIRED CONFIG)
find_package(ReactAndroid REQUIRED CONFIG)
find_package(NitroModules REQUIRED CONFIG)

# Generated C++ from `npx nitrogen` lives in packages/wuzz-nitro-text/nitrogen/generated/android/
file(GLOB NITROGEN_SRC
  "${CMAKE_SOURCE_DIR}/../../../../../packages/wuzz-nitro-text/nitrogen/generated/android/*.cpp"
  "${CMAKE_SOURCE_DIR}/../../../../../packages/wuzz-shimmer/nitrogen/generated/android/*.cpp"
)

add_library(WuzzNitroText SHARED ${NITROGEN_SRC})

target_include_directories(WuzzNitroText PRIVATE
  "${CMAKE_SOURCE_DIR}/../../../../../packages/wuzz-nitro-text/nitrogen/generated/android"
  "${CMAKE_SOURCE_DIR}/../../../../../packages/wuzz-nitro-text/nitrogen/generated/shared/c++"
  "${CMAKE_SOURCE_DIR}/../../../../../packages/wuzz-shimmer/nitrogen/generated/android"
  "${CMAKE_SOURCE_DIR}/../../../../../packages/wuzz-shimmer/nitrogen/generated/android/c++"
  "${CMAKE_SOURCE_DIR}/../../../../../packages/wuzz-shimmer/nitrogen/generated/shared/c++"
)

target_link_libraries(WuzzNitroText
  fbjni::fbjni
  ReactAndroid::jsi
  NitroModules::NitroModules
  android
  log
)
