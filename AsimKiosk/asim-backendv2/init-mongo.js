console.log("hihi");
// db.auth('AsimBEV2', 'devbybincnt')
db = new Mongo().getDB("AsimDB");
db.createCollection('PaymentConfig', { capped: false });
db.createCollection('Product', { capped: false });
db.createCollection('ExternalAPI',{ capped : false });
db.PaymentConfig.insert([{
    // "_id": {
    //   "$oid": "652fbcd7325338e74e37886f"
    // },
    "_t": [
      "Entity",
      "PaymentConfig"
    ],
    "PaymentType": 1,
    "MerchantCode": "merchantCode_internetBanking",
    "MerchantMethodCode": "merchantMethodCode_internetBanking",
    "ClientTransactionCode": "clientTransactionCode_internetBanking",
    "TerminalCode": "terminalCode_internetBanking",
    "SuccessURL": "https://bindeptrai.com",
    "CancelURL": "https://bindeptrai.com",
    "Checksum": "bindeptraivcl123456",
    "CreatedAt": "18:09:11 18-10-2023",
    "ModifiedOn": ""
  }]);
db.Product.insert([{
    // "_id": {
    //   "$oid": "652f5f5415487d57f715cb3d"
    // },
    "_t": [
      "Entity",
      "Product"
    ],
    "ProductName": "VNPass",
    "Price": 50000000,
    "Content": {
      "_t": "ContentProduct",
      "SimContent": null,
      "VNPassContent": {
        "_t": "VNPassContent",
        "City": "Bien Hoa",
        "Discription": "Tickets can be used for the public transportation vehicles: Bus, Metro, Taxi...",
        "Expirydate": "1 Year (From the date of purchase)"
      }
    },
    "CreatedAt": "11:30:12 18-10-2023",
    "ModifiedOn": null,
    "DeletedOn": null,
    "ActiveStatus": 1
  },
  {
    // "_id": {
    //   "$oid": "652f61488973f1b14573adcb"
    // },
    "_t": [
      "Entity",
      "Product"
    ],
    "ProductName": "Sim4G",
    "Price": 500000,
    "Content": {
      "_t": "ContentProduct",
      "SimContent": {
        "_t": "SimContent",
        "DataPlan30Days": "60Gb/30 Days",
        "DataPlanEachDays": "2GB/Day",
        "CallPlan": "Free call",
        "NameSimPackage": "A60S"
      },
      "VNPassContent": null
    },
    "CreatedAt": "11:38:32 18-10-2023",
    "ModifiedOn": null,
    "DeletedOn": null,
    "ActiveStatus": 1
  }
]);
db.ExternalAPI.insert(
    [
        {
            // "_id": {
            //   "$oid": "652e61c3a743d6ce4b62409c"
            // },
            "_t": [
              "Entity",
              "AggregateRoot",
              "ExternalAPI"
            ],
            "Owner": "CnT",
            "NameAPI": "ExampleEndpoint",
            "RequestType": 0,
            "Method": 0,
            "BaseUrl": "api.example.com",
            "Example": "examplestring",
            "ModifiedOn": null,
            "CreatedAt": "17:28:19 17-10-2023"
          }
    ]
)
console.log("hihuhu");