package com.asimkiosk.DeviceModule;

import android.content.Context;
import com.asimkiosk.Controls.SimDepenserControl;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.jetbrains.annotations.NotNull;

import java.util.concurrent.TimeUnit;

public class Dispenser extends ReactContextBaseJavaModule {
        private Integer currentIndex;
        private static final SimDepenserControl CONTROL = new SimDepenserControl();
        public final Context context;

        public Dispenser(ReactApplicationContext reactContext) {
            super(reactContext);
            this.context = reactContext.getApplicationContext();
        }

    @ReactMethod
    public void initDespenser(Integer index, String port, Promise promise) {
        boolean status = CONTROL.InitDispenser(index, port);
        currentIndex = index;
        promise.resolve(status);
    }

    @ReactMethod
    public void checkReadArea(Promise promise) {
        boolean status = CONTROL.checkSensorReadArea(currentIndex);
        promise.resolve(status);
    }

    @ReactMethod
    public void checkOutPut(Promise promise) {
        boolean status = CONTROL.checkSensorOutPutCard(currentIndex);
        promise.resolve(status);
    }

    @ReactMethod
    public void moveCard(Promise promise) {
        boolean status = CONTROL.moveCardToRead(currentIndex);
        promise.resolve(status);
    }

    @ReactMethod
    public void checkInBox(Promise promise) {
        boolean status = CONTROL.moveCardToRead(currentIndex);
        promise.resolve(status);
    }

    @ReactMethod
    public void outCard(Promise promise) {
        boolean status = CONTROL.injectcard(currentIndex);
        promise.resolve(status);
    }

    @ReactMethod
    public void rejectCard(Promise promise) {
        boolean status = CONTROL.rejectCardInReadArea(currentIndex);
        promise.resolve(status);
    }

    @ReactMethod
    public void readSerial(Promise promise) {
        String serial = CONTROL.readCCID(currentIndex);
        serial = (serial == null) ? "" : serial;
        promise.resolve(serial);
    }
    @ReactMethod
    public void readIdCardRF(Promise promise){
        String Idraw = CONTROL.readRFCard(currentIndex);
        String Id  = Idraw.substring(0 ,11);
        promise.resolve(Id);
    }
    @ReactMethod
    public void moveCardRF(Promise promise){
        CONTROL.moveCardRF(currentIndex);
        promise.resolve(true); // that mean seen command to reader oke
    }
        @ReactMethod
        public void getHello(Promise promise) {
            promise.resolve("hello from java ...");
        }

        @NotNull
        @Override
        public String getName() {
            return "Despenser";
        }
    }