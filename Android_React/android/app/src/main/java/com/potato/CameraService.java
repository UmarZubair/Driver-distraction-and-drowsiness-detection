package com.potato;


import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.Point;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.hardware.Camera.Parameters;
import android.os.Binder;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.view.Display;
import android.view.SurfaceHolder;
import android.view.WindowManager;

import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.modules.storage.AsyncLocalStorageUtil;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CameraService extends Service
{

    private Socket mSocket;
    {
        try {
            mSocket = IO.socket("http://192.168.43.53:3000");
        } catch (URISyntaxException e) {}
    }

    private SurfaceHolder sHolder;
    private Camera mCamera;
    private Parameters parameters;
    long startTime = 0;
    static Handler timerHandler = new Handler();
    static Handler poseHandler = new Handler();
    public static Bitmap bitmap;
    private boolean cameraFront = false;
    private boolean safeToTakePicture = false;
    private int countDrowsy =0, countHead=0, countYawn =0;
    Performance performance = new Performance();
    public String ip = "192.168.43.53";
    int check=0;
    TextToSpeech tts,text_to_speech;

    Runnable poseRunnable = new Runnable() {

        @Override
        public void run() {
            android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_BACKGROUND);
            if (safeToTakePicture) {
                mCamera.takePicture(null, null, posscall);
                safeToTakePicture = false;

                //sendMessage(performance);
            }
            poseHandler.postDelayed(this,  500);
        }
    };


    @Override
    public void onCreate()
    {

        super.onCreate();

        String currentTime = new SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(new Date());
        tts = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                tts.setLanguage(Locale.UK);
            }
        });

    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        return super.onStartCommand(intent, flags, startId);
    }




    Camera.PictureCallback  posscall = new Camera.PictureCallback() {
        @Override
        public void onPictureTaken(byte[] data, Camera camera) {
            SurfaceTexture st = new SurfaceTexture(MODE_PRIVATE);
            bitmap = BitmapFactory.decodeByteArray(data, 0, data.length);
            Bitmap resized = Bitmap.createScaledBitmap(bitmap, 240, 200, true);
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            resized.compress(Bitmap.CompressFormat.PNG, 100, stream);
            byte[] bitmapdata = stream.toByteArray();

            try {
                //sending to flask server
                poseUploadImage(bitmapdata);
                drowsyUploadImage(data);
                //yawnUploadImage(data);
               if (check==0) {
                    uploadImage(data);
                    check=1;
                }
                mCamera.setPreviewTexture(st);
                mCamera.startPreview();
                Log.d("PictureTaken", "onPictureTaken" );
                safeToTakePicture = true;
            }   catch (IOException e) {
                e.printStackTrace();
            }finally {
            }

        }
    };

    public Bitmap rotateImage(int angle, Bitmap bitmapSrc) {
        Matrix matrix = new Matrix();
        matrix.postRotate(angle);
        return Bitmap.createBitmap(bitmapSrc, 0, 0,
                bitmapSrc.getWidth(), bitmapSrc.getHeight(), matrix, true);
    }

    private int findFrontFacingCamera(){

        int cameraId = -1;
        // Search for the front facing camera
        int numberOfCameras = Camera.getNumberOfCameras();
        for (int i = 0; i < numberOfCameras; i++) {
            Camera.CameraInfo info = new Camera.CameraInfo();
            Camera.getCameraInfo(i, info);
            if (info.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
                cameraId = i;
                cameraFront = true;
                break;
            }
        }
        return cameraId;

    }
    private static Camera.Size getOptimalPreviewSize(List<Camera.Size> sizes, int w, int h) {
        final double ASPECT_TOLERANCE = 0.15;
        double targetRatio = (double) h / w;
        if (sizes == null) return null;
        Camera.Size optimalSize = null;
        double minDiff = Double.MAX_VALUE;
        for (Camera.Size size : sizes) {
            double ratio = (double) size.width / size.height;
            if (Math.abs(ratio - targetRatio) > ASPECT_TOLERANCE) continue;
            if (Math.abs(size.height - h) < minDiff) {
                optimalSize = size;
                minDiff = Math.abs(size.height - h);
            }
        }
        if (optimalSize == null) {
            minDiff = Double.MAX_VALUE;
            for (Camera.Size size : sizes) {
                if (Math.abs(size.height - h) < minDiff) {
                    optimalSize = size;
                    minDiff = Math.abs(size.height - h);
                }
            }
        }
        return optimalSize;
    }


    public class LocalBinder extends Binder {

        public CameraService getService() {
            return CameraService.this;
        }


    }
    private final IBinder mBinder = new CameraService.LocalBinder();

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        int cameraId = findFrontFacingCamera();
        SurfaceTexture st = new SurfaceTexture(MODE_PRIVATE);

        mCamera = Camera.open(cameraId);
        mCamera.setDisplayOrientation(90);
        try {
            mCamera.setPreviewTexture(st);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Parameters parameters = mCamera.getParameters();
        parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);

        WindowManager wm = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        Display display = wm.getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);

        List<Camera.Size> supportedPreviewSizes = mCamera.getParameters().getSupportedPreviewSizes();
        List<Camera.Size> supportedPictureSizes = mCamera.getParameters().getSupportedPictureSizes();
        Camera.Size optimalSize = getOptimalPreviewSize(supportedPreviewSizes, size.x, size.y);
        Camera.Size optimalPictureSize = getOptimalPreviewSize(supportedPictureSizes, size.x, size.y);

        parameters.setPreviewSize(optimalSize.width, optimalSize.height);
        parameters.setPictureSize(1800, 1000);
        mCamera.startPreview();
        safeToTakePicture = true;
        poseRunnable.run();
        mSocket.connect();
        return mBinder;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        poseHandler.removeCallbacks(poseRunnable);
        releaseCamera();
        return super.onUnbind(intent);

    }
    private void releaseCamera() {
        if (mCamera != null) {
            mCamera.stopPreview();
            mCamera.setPreviewCallback(null);
            mCamera.release();
            mCamera = null;
        }
    }

    void uploadImage(byte[] data){
        String postUrl = "http://" + ip + ":5001/recognize";
        String imageName = System.currentTimeMillis()+ "pic.jpg";
        RequestBody postBodyImage = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("image", imageName, RequestBody.create(MediaType.parse("image/*jpg"), data))
                .build();

        postRequest(postUrl, postBodyImage);

    }
    void poseUploadImage(byte[] data){
        String postUrl2 = "http://" + ip + ":5002/head_pose_detection";
        String imageName = System.currentTimeMillis()+ "pic.jpg";

        RequestBody postBodyImage = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("image", imageName, RequestBody.create(MediaType.parse("image/*jpg"), data))
                .build();


        postRequest2(postUrl2, postBodyImage);
    }

    void yawnUploadImage(byte[] data){
        String postUrl4 = "http://" + ip + ":5004/yawn_detection";
        String imageName = System.currentTimeMillis()+ "pic.jpg";

        RequestBody postBodyImage = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("image", imageName, RequestBody.create(MediaType.parse("image/*jpg"), data))
                .build();


        postRequest4(postUrl4, postBodyImage);
    }


    void drowsyUploadImage(byte[] data){

        String postUrl2 ="http://" + ip + ":5003/drowsiness_detect";
        String imageName = System.currentTimeMillis()+ "pic.jpg";

        RequestBody postBodyImage = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("image", imageName, RequestBody.create(MediaType.parse("image/*jpg"), data))
                .build();


        postRequest3(postUrl2, postBodyImage);
    }


    void postRequest(String postUrl, RequestBody postBody) {

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(postUrl)
                .post(postBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                call.cancel();
                //speak("Fail");
                Log.d("recognize", "Failed to Connect to Server");

            }

            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                //String res = "";
               // String evidence = "";
                Log.d("recognize", "Success");
                String jsonData = response.body().string();
                speak(jsonData);

                sendMessage2(jsonData);


               /* final JSONObject myResponse;
                try {
                    myResponse = new JSONObject(jsonData);
                    res = myResponse.getString("message");
                    evidence = myResponse.getString("path");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                    Log.d("recognize", res);
                   // sendMessage2(res, evidence);
                    speak(res);*/
            }
        });
    }

    void postRequest2(String postUrl, RequestBody postBody) {

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(postUrl)
                .post(postBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                call.cancel();
                Log.d("Pose Detecting Image", "Failed to Connect to Server");

            }

            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                //String res = response.body().string();
                String res = "";
                String evidence = "";
                String jsonData = response.body().string();
                final JSONObject myResponse;
                try {
                    myResponse = new JSONObject(jsonData);
                    res = myResponse.getString("message");
                    evidence = myResponse.getString("path");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                if (!res.equals("")) {
                    if(res.equals("Please look forward")){
                        countHead = 1;
                        speak(res);
                    }
                    else if(res.equals("Please look forward now")){
                        countHead = 2;
                        speak(res);
                    }
                    else if(res.equals("Now means now")){
                        countHead = 3;
                        speak(res);
                    }

                }
                if(! evidence.equals("")){
                    SQLiteDatabase readableDatabase = null;
                    readableDatabase = ReactDatabaseSupplier.getInstance(getApplicationContext()).getReadableDatabase();
                    if (readableDatabase != null) {
                        String impl = AsyncLocalStorageUtil.getItemImpl(readableDatabase, "isLoggedIn");
                        try {
                            JSONObject data = new JSONObject(impl);
                            String id = data.getString("_id");
                            int seconds = (int)GeoLocationModule.diff;
                            if(seconds > 0) {
                                mSocket.emit("addDistractEvidence", id, countHead, seconds, evidence, GeoLocationModule.StartTime);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }

        });
    }


    void postRequest3(String postUrl, RequestBody postBody) {

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(postUrl)
                .post(postBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                call.cancel();
                Log.d("drowsy Detecting Image", "Failed to Connect to Server");

            }

            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                String res = "";
                String evidence = "";
                String jsonData = response.body().string();
                final JSONObject myResponse;
                try {
                    myResponse = new JSONObject(jsonData);
                    res = myResponse.getString("message");
                    evidence = myResponse.getString("path");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                if (!res.equals("Ok")) {
                    if(res.equals("you are drowsy")){
                        countDrowsy = 1;
                        speak(res);
                    }
                    else if(res.equals("you are not in driving condition")){
                        countDrowsy = 2;
                        speak(res);
                    }
                    else if(res.equals("Stop the car")){
                        countDrowsy= 3;
                        speak(res);
                    }

                }
                if(! evidence.equals("")) {
                    SQLiteDatabase readableDatabase = null;
                    readableDatabase = ReactDatabaseSupplier.getInstance(getApplicationContext()).getReadableDatabase();
                    if (readableDatabase != null) {
                        String impl = AsyncLocalStorageUtil.getItemImpl(readableDatabase, "isLoggedIn");
                        try {
                            JSONObject data = new JSONObject(impl);
                            String id = data.getString("_id");
                            int seconds = (int)GeoLocationModule.diff;
                            if(seconds > 0) {
                                mSocket.emit("addDrowsyEvidence", id, countDrowsy, seconds, evidence, GeoLocationModule.StartTime);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }

        });
    }

    void postRequest4(String postUrl, RequestBody postBody) {

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(postUrl)
                .post(postBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                call.cancel();
                Log.d("Yawn Detecting Image", "Failed to Connect to Server");

            }

            @Override
            public void onResponse(Call call, final Response response) throws IOException {
                //String res = response.body().string();
                String res = "";
                String evidence = "";
                String jsonData = response.body().string();
                final JSONObject myResponse;
                try {
                    myResponse = new JSONObject(jsonData);
                    res = myResponse.getString("message");
                    evidence = myResponse.getString("path");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                if (!res.equals("")) {
                    countYawn = 1;
                    speak(res);
                }
                if(! evidence.equals("")){
                   // performance.setEvidenceDrowsy(evidence);
                    SQLiteDatabase readableDatabase = null;
                    readableDatabase = ReactDatabaseSupplier.getInstance(getApplicationContext()).getReadableDatabase();
                    if (readableDatabase != null) {
                        String impl = AsyncLocalStorageUtil.getItemImpl(readableDatabase, "isLoggedIn");
                        try {
                            JSONObject data = new JSONObject(impl);
                            String id = data.getString("_id");
                            int seconds = (int)GeoLocationModule.diff;
                            if(seconds > 0) {
                                mSocket.emit("addDrowsyEvidence", id, countYawn, seconds, evidence, GeoLocationModule.StartTime);
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                }
            }

        });
    }

    public void speak(final String text){ // make text 'final'

        // ... do not declare tts here

        text_to_speech = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS){
                    int result = text_to_speech.setLanguage(Locale.US);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        text_to_speech.speak(text, TextToSpeech.QUEUE_ADD, null,null);
                    }

                } else {
                    Log.e("TTS", "Failed");

                }
            }
        });
    }

    private void sendMessage(Performance performance) {
        try {
            Intent intent = new Intent("PerformanceUpdate");
            Bundle bundle = new Bundle();
            bundle.putSerializable("Rating",performance);
            intent.putExtras(bundle);
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

      private void sendMessage2(String message) {
        try {
            Intent intent = new Intent("AuthorizationUpdate");
            intent.putExtra("Auth",message);
           // intent.putExtra("Path",path);
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    



}