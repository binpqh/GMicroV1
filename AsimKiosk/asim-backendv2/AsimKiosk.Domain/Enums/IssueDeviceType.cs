using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AsimKiosk.Domain.Enums
{
   public enum IssueDeviceType
    {
        DispenserOutOfCard = 1,
        DispenserReadError = 2,
        DispenserStuckCard = 3,
        OutofPaperPrinter = 4,
        WarningPaperPrinter = 5,
        WarningTemperature = 6,
        UpsPowerOff = 7 , 
        UpsOutOfBattery = 8 ,
    }
}
