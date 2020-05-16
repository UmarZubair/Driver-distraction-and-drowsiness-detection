package com.potato;


import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import static android.content.Context.BIND_AUTO_CREATE;


public class CameraServiceModule extends ReactContextBaseJavaModule {
    CameraService myService;
    static boolean status;
    static int p = 0;
    Performance performance;
    String Auth = "";
    //String authPath = "";


    private ServiceConnection sc = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            CameraService.LocalBinder binder = (CameraService.LocalBinder) service;
            myService = binder.getService();
            status = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            status = false;
        }
    };



    void BindService() {
        if (status == true)
            return;
        Intent intent = new Intent(getReactApplicationContext(), CameraService.class);
        getReactApplicationContext().bindService(intent, sc, BIND_AUTO_CREATE);
        status = true;

    }

    void UnbindService() {
        if (status == false)
            return;
        Intent i = new Intent(getReactApplicationContext(), CameraService.class);
        getReactApplicationContext().unbindService(sc);
        status = false;
    }


    public CameraServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        BroadcastReceiver cameraReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                performance = (Performance) intent.getSerializableExtra("Rating");
                sendEvent(performance);

            }
        };
        BroadcastReceiver authReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Auth = intent.getStringExtra("Auth");
                //authPath = intent.getStringExtra("Path");
                sendEvent2(Auth);

            }
        };
        LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(cameraReceiver, new IntentFilter("PerformanceUpdate"));
        LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(authReceiver, new IntentFilter("AuthorizationUpdate"));
    }

    @Override
    public String getName() {
        return "BackgroundCamera";
    }

    @ReactMethod
    public void startService() {
        String result = "successfully start camera service";
        try {
            if (status == false)
                BindService();
                Log.d("status", result);
        } catch (Exception e) {
            Log.d("status", e.toString());
            Log.d("status", "failed");
        }


    }

    @ReactMethod
    public void stopService() {
        String result = "successfully stop camera service";
        try {
            if (status == true)
                UnbindService();
            Log.d("status", result);
        } catch (Exception e) {
            Log.d("status", e.toString());
            Log.d("status", "failed");
        }
    }


    private void sendEvent(Performance performance) {
        WritableMap coordMap = Arguments.createMap();
       // String type = "";
       /* if(!(performance.getEvidenceDrowsy().equals(""))) {
            type = "Drowsy";
        }
        if(!(performance.getEvidenceHead().equals(""))){
            type = "Distracted";
        }*/
        coordMap.putInt("countHead", performance.getCountHead());
        coordMap.putInt("countDrowsy", performance.getCountDrowsy());
        //coordMap.putString("authorized", performance.getAuthorized());
        coordMap.putString("evidenceHead", performance.getEvidenceHead());
        coordMap.putString("evidenceDrowsy", performance.getEvidenceDrowsy());
        //coordMap.putString("type", type);

        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("UpdatePerformance", coordMap);
        performance.setEvidenceDrowsy("");
        performance.setEvidenceHead("");
    }

    private void sendEvent2(String auth) {
        WritableMap coordMap = Arguments.createMap();
        coordMap.putString("authorized",auth);
        //coordMap.putString("authPath",authpath);
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("UpdateAuthorization", coordMap);

    }
}