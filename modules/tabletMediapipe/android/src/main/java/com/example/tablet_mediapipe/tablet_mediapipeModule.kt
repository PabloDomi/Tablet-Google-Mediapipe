package com.example.tablet_mediapipe

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.BroadcastReceiver
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.events.EventEmitter

class tablet_mediapipeModule : Module() {
    private val receiver = landmarkReceiver()

    override fun definition() = ModuleDefinition {
        Name("PoseLandmarker")

        Function("startListening") {
            val filter = IntentFilter("com.example.tablet_mediapipe.LANDMARK_UPDATE")
            appContext.reactContext?.registerReceiver(receiver, filter)
        }

        Function("stopListening") {
            val landmarkReceiver = landmarkReceiver()
            appContext.reactContext?.unregisterReceiver(receiver)
        }

        OnDestroy {
            try {
                appContext.reactContext?.unregisterReceiver(receiver)
            } catch (e: IllegalArgumentException) {
                // Receiver not registered
            }
        }
    }
}

class landmarkReceiver : BroadcastReceiver() {

    private lateinit var eventEmitter: EventEmitter

    override fun onReceive(context: Context?, intent: Intent?) {
        intent?.let {
            val poseIndex = it.getIntExtra("poseIndex", -1)
            val landmarkIndex = it.getIntExtra("landmarkIndex", -1)
            val x = it.getFloatExtra("x", -1f)
            val y = it.getFloatExtra("y", -1f)
            val z = it.getFloatExtra("z", -1f)
            val visibility = it.getFloatExtra("visibility", -1f)
            val presence = it.getFloatExtra("presence", -1f)

            eventEmitter.emit(
                "onLandmarkReceived",
                mapOf(
                    "poseIndex" to poseIndex,
                    "landmarkIndex" to landmarkIndex,
                    "x" to x,
                    "y" to y,
                    "z" to z,
                    "visibility" to visibility,
                    "presence" to presence
                )
            )
        }
    }
}
