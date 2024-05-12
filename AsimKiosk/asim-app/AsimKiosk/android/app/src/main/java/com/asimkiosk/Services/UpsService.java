package com.asimkiosk.Services;

import asim.sdk.common.Utils;
import asim.sdk.ups.SDKUPS;
import asim.sdk.ups.UPSConfigs;

public class UpsService {
    private static final String portName = "/dev/ttyXR6";
    private  static final int baudRate = 2400;
    private static final SDKUPS sdkups = new SDKUPS(portName,baudRate);
    public boolean connecUpsService(){
        return sdkups.connect();
    }
    public Object[] getInfoUps() {
        String[] arrayData = new String[0];
            sdkups.mPos.GetIO().Write(UPSConfigs.cmdGetInfo, 0, UPSConfigs.cmdGetInfo.length);
            byte[] status = new byte[256];
            int readResult = sdkups.mPos.GetIO().Read(status, 0, status.length, 1000);
            byte[] realStatus = Utils.getSubListByte(status, 0, readResult - 1);
            String totalInfo = (new String(realStatus)).trim();
            arrayData = totalInfo.split(" ");
        return arrayData;
    }
    public double getBatteryLevel(){
        return  sdkups.getBatteryLevel();
    }
}
