package com.example.tablet_mediapipe


import android.content.Context
import android.view.LayoutInflater
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class tablet_mediapipeView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    init {
        // Inflate el layout de fragment_camera directly
        val inflater = LayoutInflater.from(context)
        inflater.inflate(R.layout.activity_main, this, true)
    }
}
