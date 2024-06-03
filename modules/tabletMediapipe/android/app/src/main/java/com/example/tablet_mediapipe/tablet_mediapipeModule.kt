package com.example.tablet_mediapipe

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

class PoseLandmarkerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val landmarkReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            intent?.let {
                val poseIndex = it.getIntExtra("poseIndex", -1)
                val landmarkIndex = it.getIntExtra("landmarkIndex", -1)
                val x = it.getFloatExtra("x", -1f)
                val y = it.getFloatExtra("y", -1f)
                val z = it.getFloatExtra("z", -1f)
                val visibility = it.getFloatExtra("visibility", -1f)
                val presence = it.getFloatExtra("presence", -1f)

                sendEvent("onLandmarkReceived", Arguments.createMap().apply {
                    putInt("poseIndex", poseIndex)
                    putInt("landmarkIndex", landmarkIndex)
                    putDouble("x", x.toDouble())
                    putDouble("y", y.toDouble())
                    putDouble("z", z.toDouble())
                    putDouble("visibility", visibility.toDouble())
                    putDouble("presence", presence.toDouble())
                })
            }
        }
    }

    override fun getName(): String {
        return "PoseLandmarker"
    }

    @ReactMethod
    fun startListening() {
        val filter = IntentFilter("com.example.tablet_mediapipe.LANDMARK_UPDATE")
        reactContext.registerReceiver(landmarkReceiver, filter)
    }

    @ReactMethod
    fun stopListening() {
        reactContext.unregisterReceiver(landmarkReceiver)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
