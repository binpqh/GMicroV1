package com.asimkiosk.Controls;

import android.content.Context;
import com.asimkiosk.Services.LockerService;


public class LockerControl {
    LockerService lockerService = new LockerService();
    public void openLockerController(Context context){
        lockerService.openLockerService(context);
    }
}
