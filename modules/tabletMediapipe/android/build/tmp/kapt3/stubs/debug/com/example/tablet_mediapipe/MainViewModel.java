package com.example.tablet_mediapipe;

/**
 * This ViewModel is used to store pose landmarker helper settings
 */
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\"\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u0007\n\u0002\b\u0010\n\u0002\u0010\u0002\n\u0002\b\b\u0018\u00002\u00020\u0001B\u0005\u00a2\u0006\u0002\u0010\u0002J\u000e\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00020\u0004J\u000e\u0010\u0019\u001a\u00020\u00172\u0006\u0010\u001a\u001a\u00020\u0006J\u000e\u0010\u001b\u001a\u00020\u00172\u0006\u0010\u001a\u001a\u00020\u0006J\u000e\u0010\u001c\u001a\u00020\u00172\u0006\u0010\u001a\u001a\u00020\u0006J\u000e\u0010\u001d\u001a\u00020\u00172\u0006\u0010\u001e\u001a\u00020\u0004R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0006X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\u0006X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\u0004X\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0011\u0010\n\u001a\u00020\u00048F\u00a2\u0006\u0006\u001a\u0004\b\u000b\u0010\fR\u0011\u0010\r\u001a\u00020\u00068F\u00a2\u0006\u0006\u001a\u0004\b\u000e\u0010\u000fR\u0011\u0010\u0010\u001a\u00020\u00068F\u00a2\u0006\u0006\u001a\u0004\b\u0011\u0010\u000fR\u0011\u0010\u0012\u001a\u00020\u00068F\u00a2\u0006\u0006\u001a\u0004\b\u0013\u0010\u000fR\u0011\u0010\u0014\u001a\u00020\u00048F\u00a2\u0006\u0006\u001a\u0004\b\u0015\u0010\f\u00a8\u0006\u001f"}, d2 = {"Lcom/example/tablet_mediapipe/MainViewModel;", "Landroidx/lifecycle/ViewModel;", "()V", "_delegate", "", "_minPoseDetectionConfidence", "", "_minPosePresenceConfidence", "_minPoseTrackingConfidence", "_model", "currentDelegate", "getCurrentDelegate", "()I", "currentMinPoseDetectionConfidence", "getCurrentMinPoseDetectionConfidence", "()F", "currentMinPosePresenceConfidence", "getCurrentMinPosePresenceConfidence", "currentMinPoseTrackingConfidence", "getCurrentMinPoseTrackingConfidence", "currentModel", "getCurrentModel", "setDelegate", "", "delegate", "setMinPoseDetectionConfidence", "confidence", "setMinPosePresenceConfidence", "setMinPoseTrackingConfidence", "setModel", "model", "tabletMediapipe_debug"})
public final class MainViewModel extends androidx.lifecycle.ViewModel {
    private int _model = 0;
    private int _delegate = 0;
    private float _minPoseDetectionConfidence = 0.5F;
    private float _minPoseTrackingConfidence = 0.5F;
    private float _minPosePresenceConfidence = 0.5F;
    
    public MainViewModel() {
        super();
    }
    
    public final int getCurrentDelegate() {
        return 0;
    }
    
    public final int getCurrentModel() {
        return 0;
    }
    
    public final float getCurrentMinPoseDetectionConfidence() {
        return 0.0F;
    }
    
    public final float getCurrentMinPoseTrackingConfidence() {
        return 0.0F;
    }
    
    public final float getCurrentMinPosePresenceConfidence() {
        return 0.0F;
    }
    
    public final void setDelegate(int delegate) {
    }
    
    public final void setMinPoseDetectionConfidence(float confidence) {
    }
    
    public final void setMinPoseTrackingConfidence(float confidence) {
    }
    
    public final void setMinPosePresenceConfidence(float confidence) {
    }
    
    public final void setModel(int model) {
    }
}