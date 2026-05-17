Pod::Spec.new do |spec|
  spec.name         = "WuzzNitroText"
  spec.version      = "1.0.0"
  spec.summary      = "Nitro-powered text measurement for Wuzz"
  spec.homepage     = "https://github.com/wuzz"
  spec.license      = { :type => "MIT" }
  spec.authors      = { "Wuzz" => "dev@wuzz.id" }
  spec.platforms    = { :ios => "14.0" }
  spec.source       = { :path => "." }

  spec.source_files = ["ios/**/*.{swift,h,m,mm,cpp}"]

  spec.pod_target_xcconfig = {
    "HEADER_SEARCH_PATHS" => [
      "$(PODS_TARGET_SRCROOT)/nitrogen/generated/ios",
      "$(PODS_TARGET_SRCROOT)/nitrogen/generated/ios/c++",
      "$(PODS_TARGET_SRCROOT)/nitrogen/generated/shared/c++",
    ].join(" "),
  }

  spec.user_target_xcconfig = { "OTHER_LDFLAGS" => "-ObjC" }

  load 'nitrogen/generated/ios/WuzzNitroText+autolinking.rb'
  add_nitrogen_files(spec)
end
