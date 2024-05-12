const ServiceEnum = {
    //SignalR
    SIGNALR: 'KioskHub?deviceId=',
    //Log Errors
    LOGERRORS: 'api/AppKiosk/logApi',
    //Login
    ASSETS: 'api/AppKiosk/assets',//v-AssetsRepository
    GET_CONFIG: 'api/AppKiosk/getConfig',//v-GlobalRepository
    CHECK_QUANTITY: 'api/AppKiosk/check-quantity',//v-PaymentCardRepository
    ORDER_SIM: 'api/AppKiosk/order',//v-PaymentCardRepository
    PAYMENT: 'api/AppKiosk/payment',//v-PaymentCardRepository
    ADD_PACKAGE_SIM: 'api/AppKiosk/addPackageSim',//v-PaymentCardRepository
    TEMPERTURE: "api/AppKiosk/log-temperature",//v-LogRepository
    LOGUPS: 'api/AppKiosk/log-ups',//v-LogRepository
    PRINTER: 'api/AppKiosk/log-printer',//v-LogRepository
    UPLOAD: 'api/AppKiosk/upload',//v-AssetsRepository
    RATTING: 'api/AppKiosk/rating'//v-GlobalRepository
}
//Log
//User experience

export default ServiceEnum