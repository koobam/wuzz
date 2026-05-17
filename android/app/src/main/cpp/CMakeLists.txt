cmake_minimum_required(VERSION 3.13)
project(WuzzNitroText)

set(CMAKE_CXX_STANDARD 20)

find_package(fbjni REQUIRED CONFIG)
find_package(ReactAndroid REQUIRED CONFIG)
find_package(NitroModules REQUIRED CONFIG)

# Generated C++ from `npx nitrogen` lives in nitrogen/generated/android/
file(GLOB NITROGEN_SRC
     "${CMAKE_SOURCE_DIR}/../../../../../nitrogen/generated/android/*.cpp"
)

add_library(WuzzNitroText SHARED ${NITROGEN_SRC})

target_include_directories(WuzzNitroText PRIVATE
  "${CMAKE_SOURCE_DIR}/../../../../../nitrogen/generated/android"
)

target_link_libraries(WuzzNitroText
  fbjni::fbjni
  ReactAndroid::jsi
  NitroModules::NitroModules
  android
  log
)
