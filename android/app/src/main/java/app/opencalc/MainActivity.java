package app.opencalc;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

/**
 * MainActivity — the single Android Activity that hosts the OpenCalc
 * WebView (via Capacitor). All app logic lives in the web bundle; this
 * class is just the thin native shell.
 *
 * No special lifecycle handling is needed — Capacitor's BridgeActivity
 * manages the WebView state, and OpenCalc persists its data in
 * localStorage which Android preserves across config changes.
 */
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // The WebView is created by BridgeActivity. We just tweak a
        // few settings here for best UX.
        WebView webView = this.bridge.getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            // Allow JS, DOM storage, and offline operation
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            // Cache aggressively so the app works fully offline
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
            // Disable file access from the WebView (security)
            settings.setAllowFileAccess(false);
            settings.setAllowContentAccess(false);
        }
    }
}
