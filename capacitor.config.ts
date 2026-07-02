import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for the OpenCalc Android APK.
 *
 * The appId and appName here MUST match what you registered in the
 * keystore (alias `opencalc`). They cannot be changed after the first
 * release without a new package name and a fresh install for users.
 *
 * NOTE: This config is committed to the repo. Secrets (keystore,
 * passwords) are NEVER referenced here — they live as GitHub
 * repository secrets and are consumed by the GitHub Actions workflow
 * at build time.
 */
const config: CapacitorConfig = {
  appId: "app.opencalc",
  appName: "OpenCalc",
  webDir: "out",
  bundledWebRuntime: false,
  android: {
    buildOptions: {
      keystorePath: undefined, // provided by CI via env var
      keystoreAlias: "opencalc",
    },
    backgroundColor: "#131816",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  server: {
    androidScheme: "https",
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#0f6e54",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
    Preferences: {
      group: "opencalc-v1",
    },
  },
};

export default config;
