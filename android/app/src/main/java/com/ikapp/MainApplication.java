package com.ikapp;

import android.app.Application;

import com.facebook.react.ReactApplication;

import org.reactnative.camera.RNCameraPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import cl.json.RNSharePackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import me.hauvo.thumbnail.RNThumbnailPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.sensors.RNSensorsPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.jimmydaddy.imagemarker.ImageMarkerPackage;
import com.arthenica.reactnative.RNFFmpegPackage;

import com.BV.LinearGradient.LinearGradientPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.brentvatne.react.ReactVideoPackage;

import com.mackentoch.beaconsandroid.BeaconsAndroidPackage;
import com.polidea.reactnativeble.BlePackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnative.photoview.PhotoViewPackage;


//fce
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

   //FBSDK
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
  //

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
           
            new RNCameraPackage(),
            new PickerPackage(),
            new RNSharePackage(),
            new FastImageViewPackage(),
            new RNThumbnailPackage(),
            new RNFetchBlobPackage(),
            new RNSensorsPackage(),
            new ImageResizerPackage(),
            new ImageMarkerPackage(),
            new RNFFmpegPackage(),
            new FBSDKPackage(mCallbackManager),
            new LinearGradientPackage(),
            new OrientationPackage(),
            new VectorIconsPackage(),
            new KCKeepAwakePackage(),
            new ReactVideoPackage(),
            //new NavigationReactPackage(),
            new BeaconsAndroidPackage(),
            new BlePackage(),
            new ReactNativePushNotificationPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new BackgroundJobPackage(),
            new PhotoViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
