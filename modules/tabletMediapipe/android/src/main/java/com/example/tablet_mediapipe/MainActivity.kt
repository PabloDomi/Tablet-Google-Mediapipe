package com.example.tablet_mediapipe

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.tablet_mediapipe.databinding.ActivityMainBinding
import android.widget.Button

class MainActivity : AppCompatActivity() {
    private lateinit var activityMainBinding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        activityMainBinding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(activityMainBinding.root)

        // Botón para acabar el ejercicio
        val btnEndExercise: Button = findViewById(R.id.btn_end_exercise)
        btnEndExercise.setOnClickListener {
            finish()
        }
    }
}