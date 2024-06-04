package com.example.tablet_mediapipe

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.BroadcastReceiver
import android.view.ViewGroup
import com.example.tablet_mediapipe.fragment.CameraFragment
import com.facebook.react.bridge.ReactContext
import com.facebook.react.fabric.events.EventEmitterWrapper
import expo.modules.adapters.react.services.EventEmitterModule
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.events.EventEmitter


class tablet_mediapipeModule : Module() {

    override fun definition() = ModuleDefinition {
        Name("tablet_mediapipeView")

        Events("onLandmarkReceived")

        View(
            tablet_mediapipeView::class,
            body = {
                ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            }
        )

        Function("getPoseResults") {
            return@Function CameraFragment.poseResults
        }

    }
}