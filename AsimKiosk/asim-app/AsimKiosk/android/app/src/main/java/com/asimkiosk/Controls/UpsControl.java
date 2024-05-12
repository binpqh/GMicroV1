package com.asimkiosk.Controls;

import com.asimkiosk.Services.UpsService;

public class UpsControl {
    private static final UpsService upsControl = new UpsService();
    public Object[] getInfoUpsControl(){
        Object[] upsInfo = new Object[5];
        if(upsControl.connecUpsService()) upsInfo = upsControl.getInfoUps();
        return upsInfo;
    }
    public double getBatteryLevelControl(){
        double batteryLevel = 0;
        if(upsControl.connecUpsService()) batteryLevel =  upsControl.getBatteryLevel();
        return batteryLevel;
    }
}
