package com.potato;

import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Point;
import android.hardware.Camera;
import android.net.Uri;
import android.os.HandlerThread;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Display;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.os.Handler;
import android.widget.Toast;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

public class CameraView extends LinearLayout {
    private Camera mCamera;
    private CameraPreview mPreview;
    private Camera.PictureCallback mPicture;
    private Context myContext;
    private ImageView displayPic;
    private boolean cameraFront = false;
    public static Bitmap bitmap;
    long startTime = 0;
    Handler timerHandler = new Handler();
    public Boolean isOpen = false;

    public void setIsOpen (Boolean initialBulbStatus){
        isOpen = initialBulbStatus;
        RunThread();
    }

    Runnable timerRunnable = new Runnable() {

        @Override
        public void run() {
            long millis = System.currentTimeMillis() - startTime;
            int seconds = (int) (millis / 1000);
            int minutes = seconds / 60;
            seconds = seconds % 60;
            //Toast.makeText(myContext, "Running!", Toast.LENGTH_SHORT).show();
            mCamera.takePicture(null, null, mcall);
            timerHandler.postDelayed(this, 8000);
        }
    };

    public CameraView(Context context) {
        super(context);
        myContext = context;
        int cameraId = findFrontFacingCamera();
        if (cameraId >= 0) {
            mCamera = Camera.open(cameraId);
            mCamera.setDisplayOrientation(90);
            Camera.Parameters parameters = mCamera.getParameters();
            parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);

            WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
            Display display = wm.getDefaultDisplay();
            Point size = new Point();
            display.getSize(size);

            List<Camera.Size> supportedPreviewSizes = mCamera.getParameters().getSupportedPreviewSizes();
            List<Camera.Size> supportedPictureSizes = mCamera.getParameters().getSupportedPictureSizes();
            Camera.Size optimalSize = getOptimalPreviewSize(supportedPreviewSizes, size.x, size.y);
            Camera.Size optimalPictureSize = getOptimalPreviewSize(supportedPictureSizes, size.x, size.y);

            parameters.setPreviewSize(optimalSize.width, optimalSize.height);
            parameters.setPictureSize(optimalPictureSize.width, optimalPictureSize.height);

            mPreview = new CameraPreview(myContext, mCamera);
            this.addView(mPreview, 900, 900);
            mCamera.startPreview();


        }
    }



    public CameraView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CameraView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
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

    private void RunThread() {
        if (isOpen) {

            timerRunnable.run();
        } else {
            timerHandler.removeCallbacks(timerRunnable);

        }
    }

    private void releaseCamera() {
        // stop and release camera
        if (mCamera != null) {
            mCamera.stopPreview();
            mCamera.setPreviewCallback(null);
            mCamera.release();
            mCamera = null;
        }
    }

        Camera.PictureCallback  mcall = new Camera.PictureCallback() {
            @Override
            public void onPictureTaken(byte[] data, Camera camera) {
                bitmap = BitmapFactory.decodeByteArray(data, 0, data.length);
                FileOutputStream outStream = null;
                try {
                    // Write to SD Card
                    outStream = new FileOutputStream(String.format("/sdcard/DCIM/queries.jpg",
                            System.currentTimeMillis()));
                    outStream.write(data);
                    outStream.close();
                    mCamera.startPreview();
                    Log.d("PictureTaken", "onPictureTaken - wrote bytes: " + data.length);
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();

                }  finally {
                }
                 // Log.d(TAG, "onPictureTaken - jpeg");

            }
    };


}
