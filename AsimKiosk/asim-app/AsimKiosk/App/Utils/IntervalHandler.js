import UPSSevice from "../Service/UPSSevice";
import StaticData from "../Variables/StaticData";
import SignalRHub from '../Utils/SignalRHub'
class IntervalHandler {
    constructor() {
        this.inputVolCounting = 0;
        this.upsCounting = 0;
        this.interval = null;
        this.signalRCounting = 0;
        this.upsServices = new UPSSevice();

        //Auto delete Video
        this.exlusionScreensForAutoDeleteVideoRecord = ["RattingScreen"];
        // Return to Home after some second
        this.countingTimeReturnToHome = 0;
        this.lastScreenForReturnToHome = 'Home';
        this.exlusionScreensForReturnToHome = ["Home",
            "PaymentCardScreen",
            "ErrorPayment",
            "PaymentSuccess",
            "CollectSimCard",
            "ErrorReturnCard",
            "PrintInvoiceScreen",
            "ErrorsPrint",
            "RattingScreen",
            "ErrorsScreen",
            "MaintenanceScreen"];
        //////Kiosk state to server
        this.lastScreenForUpdateKioskState = '';
        this.kioskStateCounting = 0;
        this.busyScreens = ["ChooseServicesScreen", "ChooseTypeServicesScreen", "SelectPaymentMethodScreen", "PaymentCardScreen", "ErrorPayment", "PaymentSuccess", "CollectSimCard", "ErrorReturnCard", "PrintInvoiceScreen", "ErrorsPrint", "RattingScreen", "ErrorsScreen"];
        //
        this.startInterval();
    }

    startInterval() {

        this.interval = setInterval(async () => {
            this.inputVolCounting++;
            this.upsCounting++;
            this.kioskStateCounting++;
            this.countingTimeReturnToHome++;
            this.signalRCounting++;

            if(StaticData.isActive == true){
                this.countingTimeReturnToHome = 0;
                StaticData.isActive = false;
            }

            if (this.lastScreenForReturnToHome != StaticData.routerName) {
                this.lastScreenForReturnToHome = StaticData.routerName;// Xử lý cập nhật dữ liệu qua qua màn hình mới
                this.countingTimeReturnToHome = 0;
            }
            /// Auto back to Home Screen and delete Video record
            if (this.countingTimeReturnToHome >= StaticData.timeToAutoReturnToHome) {
                this.countingTimeReturnToHome = 0;
                this.lastScreenForReturnToHome = StaticData.routerName;
                if (!this.exlusionScreensForReturnToHome.includes(this.lastScreenForReturnToHome)) {
                    if (!this.exlusionScreensForAutoDeleteVideoRecord.includes(this.lastScreenForReturnToHome)) {
                        StaticData.video = -1;
                    }
                    this.lastScreenForReturnToHome = "Home";
                    StaticData.navigation.navigate('Home');
                }

            }


            if (this.kioskStateCounting >= 3) {
                this.kioskStateCounting = 0;

                if (this.lastScreenForUpdateKioskState != StaticData.routerName) {
                    if (!this.busyScreens.includes(this.lastScreenForUpdateKioskState) || !this.busyScreens.includes(StaticData.routerName)) {
                        if (StaticData.routerName === 'Home') {
                            console.log("send 0");
                            SignalRHub.addCurrentKioskState(0);
                        } else
                            if (StaticData.routerName === 'MaintenanceScreen') {
                                console.log("send -1");
                                SignalRHub.addCurrentKioskState(-1);
                            } else {
                                console.log("send 1");
                                SignalRHub.addCurrentKioskState(1);
                            }
                    }
                    this.lastScreenForUpdateKioskState = StaticData.routerName;
                }
            }

            if (this.upsCounting >= 300) {
                this.upsCounting = 0;
                var temperature = await this.upsServices.getTemperature();
                var upsInfor = await this.upsServices.getInforUPSControl();
                var batery = await this.upsServices.getBatteryLevel();

                //send to server

                this.upsServices.upsInforSend(upsInfor, batery);
                this.upsServices.temperatureSend(temperature);
            }
            if (this.signalRCounting >= 3) {
                this.signalRCounting = 0;
                if (SignalRHub.hubConnection.state === 'Disconnected') {
                    await SignalRHub.StartHub();
                }
                if( SignalRHub.hubConnection.state === 'Disconnected' && StaticData.routerName != "CollectSimCard"){
                    if(StaticData.mantainanceType <= 0){
                        StaticData.mantainanceType = -1;
                    }
                    StaticData.navigation.navigate('MaintenanceScreen');
                }
                if( SignalRHub.hubConnection.state== "Connected" && StaticData.mantainanceType == -1 && StaticData.routerName == "MaintenanceScreen"){
                    StaticData.mantainanceType = 0;
                    StaticData.navigation.navigate('Home');
                }
          
            }


            if (StaticData.forceToMantainance == true && StaticData.routerName === "Home") {
                if (StaticData.mantainanceType <= 1) {
                    StaticData.mantainanceType = 1;
                }
                StaticData.forceToMantainance = false;
                StaticData.navigation.navigate('MaintenanceScreen');
            }

            if (this.inputVolCounting >= 30) {
                this.inputVolCounting = 0;
                var upsInfor = await this.upsServices.getInforUPSControlv1();
                if (upsInfor.inputVoltage <= 30) {
                    if (StaticData.routerName == "Home") {
                        if (StaticData.mantainanceType <= 1) {
                            StaticData.mantainanceType = 1;
                        }
                        StaticData.navigation.navigate('MaintenanceScreen');
                    } else {
                        StaticData.forceToMantainance = true;
                    }
                }
                else {
                    if (upsInfor.inputVoltage >= 30 && StaticData.mantainanceType == 1) {
                        StaticData.mantainanceType = 0;
                        StaticData.navigation.navigate('Home');
                    }
                }
            }
        }, 1000);
    }
    stopInterval() {
        clearInterval(this.interval);
    }
}


export default IntervalHandler;
