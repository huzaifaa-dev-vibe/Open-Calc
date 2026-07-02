# ProGuard rules for OpenCalc release builds.
# Capacitor + WebView apps need to keep these classes intact.

# Keep Capacitor bridge classes
-keep class com.getcapacitor.** { *; }
-keep class app.opencalc.** { *; }
-keepclassmembers class * {
    @com.getcapacitor.annotation.* <methods>;
    @com.getcapacitor.annotation.* <fields>;
}

# Keep WebView JavaScript interface methods (used by Capacitor bridge)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Suppress warnings about missing optional packages
-dontwarn com.getcapacitor.**

# Optimize for size — we don't use reflection outside Capacitor
-allowaccessmodification
-repackageclasses ""
