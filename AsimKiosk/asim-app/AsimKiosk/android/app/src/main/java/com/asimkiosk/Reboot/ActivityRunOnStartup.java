package com.asimkiosk.Reboot;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.asimkiosk.MainActivity;
import android.util.Log;

public class ActivityRunOnStartup extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("BroadcastReceiver","BroadcastReceiver");
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Intent i = new Intent(context, MainActivity.class);
            context.startActivity(i);
        }
    }
}
