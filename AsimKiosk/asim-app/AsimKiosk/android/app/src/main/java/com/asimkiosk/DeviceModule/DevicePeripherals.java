package com.asimkiosk.DeviceModule;

import android.content.Context;
import android.util.Log;
import com.asimkiosk.Controls.LockerControl;
import com.asimkiosk.Controls.TemperatureControl;
import com.asimkiosk.Controls.UpsControl;
import com.asimkiosk.Helper;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.jetbrains.annotations.NotNull;
import android.os.Build;

public class DevicePeripherals extends ReactContextBaseJavaModule {

    TemperatureControl temperatureControl = new TemperatureControl();
    LockerControl lockerControl = new LockerControl();
    UpsControl upsControl = new UpsControl();
    public static class UpsModel {
        public String inputVoltage = "0";
        public String outputVoltage = "0";
        public String consumedLoad = "0";
        public String batteryVoltage = "0";
        public String frequencyOutput = "0";

    }

    public final Context context;
    public DevicePeripherals(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext.getApplicationContext();
    }

    /**
     *
     * return temperature sensor by promise
     */
    @ReactMethod
    public void getTemperature(Promise promise){
            double tem =  temperatureControl.getTemperatureControl(context);
            promise.resolve(tem);
    }

    /**
     *
     */
    @ReactMethod
    public void openLocker(){
        lockerControl.openLockerController(context);
    }


    /**
     * return battery Level Ups in Kiosk if return null connect false
     */
    @ReactMethod
    public void getBatteryLevel(Promise promise){
            promise.resolve(upsControl.getBatteryLevelControl());
    }

    /**
     *
     * return (json) info Ups in Kiosk if return 0 connect false
     * //example return :
     * "batteryVoltage":27.1,
     * "consumedLoad":7.0,
     * "frequencyOutput":49.8,
     * "inputVoltage":219.8,
     * "outputVoltage":219.7,
     *  // end example return
     */
    @ReactMethod
    public void getInfoUps(Promise promise){
        UpsModel model = new UpsModel();
        Object[] upsInfo = upsControl.getInfoUpsControl();

        model.inputVoltage = upsInfo[1].toString();
        model.outputVoltage = upsInfo[4].toString();
        model.consumedLoad = upsInfo[6].toString();
        model.frequencyOutput = upsInfo[7].toString();
        model.batteryVoltage = upsInfo[10].toString();

          promise.resolve(Helper.convertUPSModelToJson(model));
      }
    /**
     *
     * return the serialnumber device
     */
    @ReactMethod
    public void getSerial(Promise promise){
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.GINGERBREAD) {
            String serialNumber = Build.SERIAL;
            promise.resolve(serialNumber);
        }
    }
    @NotNull
    @Override
    public String getName() {
        return "DevicePeripherals";
    }
}
