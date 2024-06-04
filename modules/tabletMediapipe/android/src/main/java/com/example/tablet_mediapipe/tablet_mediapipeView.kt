package com.example.tablet_mediapipe

import android.content.Context
import android.content.Intent
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.ExpoModulesHelper

import expo.modules.kotlin.views.ExpoView

class tablet_mediapipeView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
        init {
            val intent = Intent(context, MainActivity::class.java)
            context.startActivity(intent)
        }
}
