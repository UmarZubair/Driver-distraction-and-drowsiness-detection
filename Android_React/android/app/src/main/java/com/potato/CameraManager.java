package com.potato;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class CameraManager extends SimpleViewManager<CameraView>  {


    @Override
    public String getName() {
        return "CameraComponent";
    }

    @Override
    protected CameraView createViewInstance(ThemedReactContext reactContext) {

        return new CameraView(reactContext);

    }
    @ReactProp(name="isOpen")
    public void setCameraStatus(CameraView CameraView, Boolean isOpen) {
        CameraView.setIsOpen(isOpen);
    }
}
