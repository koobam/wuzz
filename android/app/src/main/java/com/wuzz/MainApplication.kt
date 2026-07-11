package com.wuzz

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.uimanager.ViewManager
import com.hotupdater.HotUpdater 
import com.margelo.nitro.com.wuzz.nitrotext.WuzzNitroTextOnLoad
import com.margelo.nitro.com.wuzz.shimmer.WuzzShimmerOnLoad
import com.wuzz.shimmer.ShimmerPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
        packageList =
        PackageList(this).packages.apply { add(ShimmerPackage()) },
        jsBundleFilePath = HotUpdater.getJSBundleFile(applicationContext), 
    )
  }

  override fun onCreate() {
    super.onCreate()
    WuzzNitroTextOnLoad.initializeNative()
    WuzzShimmerOnLoad.initializeNative()
    loadReactNative(this)
  }
}
