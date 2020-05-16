package com.potato;


import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.location.Address;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import static android.content.Context.BIND_AUTO_CREATE;
import static android.content.Context.LOCATION_SERVICE;


public class GeoLocationModule extends ReactContextBaseJavaModule {
    LocationService myService;
    static boolean status;
    LocationManager locationManager;
    static long startTime, endTime, diff;
    static String StartTime;
    Location  lStart, lEnd;
    static int p = 0;
    static double distance = 0;
    double speed, mspeed;
    Address locationAddress;
    private ServiceConnection sc = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            LocationService.LocalBinder binder = (LocationService.LocalBinder) service;
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
        Intent intent = new Intent(getReactApplicationContext(), LocationService.class);
        getReactApplicationContext().bindService(intent, sc, BIND_AUTO_CREATE);
        status = true;
        DateTimeFormatter dtf = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            dtf = DateTimeFormatter.ofPattern("HH:mm:ss");
        }
        LocalDateTime now = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            now = LocalDateTime.now();
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            StartTime = dtf.format(now).toString();
        }

        Date today = new Date();
        int h = today.getHours();
        int m = today.getMinutes();
        int s = today.getSeconds();
        String ampm = h >= 12 ? "pm" : "am";
        h = h % 12;
        h = h!=0 ? h : 12;
        m = m < 10 ? '0' + m : m;
        s = (s < 10 ? '0' + s : s)+1;
        StartTime = h + ":" + m + ":" + s + ' ' + ampm;
        startTime = System.currentTimeMillis();
    }

    void UnbindService() {
        if (status == false)
            return;
        Intent i = new Intent(getReactApplicationContext(), LocationService.class);
        getReactApplicationContext().unbindService(sc);
        status = false;
    }


    public GeoLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        BroadcastReceiver geoLocationReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Location message = intent.getParcelableExtra("message");
                if(!LocationService.getAddress(message.getLatitude(),message.getLongitude(), getReactApplicationContext()).equals("")) {
                    locationAddress = LocationService.getAddress(message.getLatitude(), message.getLongitude(), getReactApplicationContext());
                    sendEvent(message);
                }
                speed = message.getSpeed() * 18 / 5;
            }
        };
        LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(geoLocationReceiver, new IntentFilter("GeoLocationUpdate"));
    }

    @Override
    public String getName() {
        return "GeoLocation";
    }

    @ReactMethod
    public void startService() {
        String result = "successfully start location service";
        try {
            //The method below checks if Location is enabled on device or not. If not, then an alert dialog box appears with option
            //to enable gps.
            checkGps();
            locationManager = (LocationManager) getReactApplicationContext().getSystemService(LOCATION_SERVICE);

            if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {

                return;
            }


            if (status == false)
                //Here, the Location Service gets bound and the GPS Speedometer gets Active.
                BindService();
            Log.d("status", result);
            // promise.resolve(result);
        } catch (Exception e) {
            Log.d("status", e.toString());
            Log.d("status", "failed");
            //promise.reject(e);
        }


    }

    @ReactMethod
    public void stopService() {
        String result = "successfully stop location service";
        try {
            if (status == true)
                UnbindService();
                distance = 0;
                speed = 0;
                diff= 0;
                mspeed = 0;


            Log.d("status", result);
            // promise.resolve("successfully stop service");
        } catch (Exception e) {
            Log.d("status", e.toString());
            Log.d("status", "failed");
            //promise.reject(e);
        }
    }

    //This method leads you to the alert dialog box.
    void checkGps() {
        locationManager = (LocationManager) getReactApplicationContext().getSystemService(LOCATION_SERVICE);

        if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {

        }
    }

    private void sendEvent(Location message) {
        WritableMap coordMap = Arguments.createMap();
        if (lStart == null) {
            lStart = message;
            lEnd = message;
        } else
            lEnd = message;
        distance = distance + (lStart.distanceTo(lEnd) / 1000.00);
        endTime = System.currentTimeMillis();
        diff = endTime - startTime;
        //diff = TimeUnit.MILLISECONDS.toMinutes(diff);
        diff = TimeUnit.MILLISECONDS.toSeconds(diff);
        lStart = lEnd;
        mspeed= message.getSpeed();

        coordMap.putDouble("distance",(distance) );
        coordMap.putDouble("current_speed",speed);
        coordMap.putDouble("time",  diff );
        coordMap.putDouble("mspeed", mspeed );
        coordMap.putString("StartTime", StartTime);
        if(!locationAddress.getAddressLine(0).equals("") ) {
            coordMap.putString("address", locationAddress.getAddressLine(0));
        }
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("updateLocation", coordMap);
    }
}