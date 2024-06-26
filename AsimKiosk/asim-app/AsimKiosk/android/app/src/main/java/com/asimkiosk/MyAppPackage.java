package com.asimkiosk;
import com.asimkiosk.DeviceModule.DevicePeripherals;
import com.asimkiosk.DeviceModule.Dispenser;
import com.asimkiosk.DeviceModule.Printer;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import org.jetbrains.annotations.NotNull;
import com.asimkiosk.Reboot.RebootHelper;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyAppPackage implements ReactPackage {

    @NotNull
    @Override
    public List<ViewManager> createViewManagers(@NotNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @NotNull
    @Override
    public List<NativeModule> createNativeModules(
            @NotNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new Dispenser(reactContext));
        modules.add(new Printer(reactContext));
        modules.add(new DevicePeripherals(reactContext));
        modules.add(new RebootHelper(reactContext));
        return modules;
    }

}