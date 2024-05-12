package com.asimkiosk.Controls;

import android.content.Context;
import com.asimkiosk.Services.TemperatureService;

public class TemperatureControl {
    TemperatureService temperatureService = new TemperatureService();
    public double getTemperatureControl(Context context){
        return temperatureService.getTemperatureService(context);
    }
}
