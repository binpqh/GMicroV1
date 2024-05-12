package com.asimkiosk.Reboot;
import android.content.Context;
import android.util.Log;
import com.asimkiosk.Helper;
import com.facebook.react.bridge.*;
import org.jetbrains.annotations.NotNull;
import android.content.Intent;
import java.util.*;

public class RebootHelper extends ReactContextBaseJavaModule {
    public final Context context;
    public RebootHelper(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext.getApplicationContext();
    }


     @ReactMethod
    public void Reboot() {
        try{
            Process proc = Runtime.getRuntime().exec(new String[] { "reboot" });
            proc.waitFor();
        }
        catch (Exception ex) {
            Log.v("log:", ex.getMessage());
        }  
    }
   
    @NotNull
    @Override
    public String getName() {
        return "RebootHelper";
    }
}
