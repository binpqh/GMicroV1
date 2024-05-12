namespace AsimKiosk.Application.Core.Common;

public static class DeviceHealthCalculator
{
    public static double Calculate(int totalPeripherals, int faultyPeripherals) 
    {
        if(totalPeripherals == 0)
        {  
            return 100; 
        }
        double totalHealth = 100;
        var healthReductionValue = (double)100 / totalPeripherals;
        var totalHealthLoss = faultyPeripherals * healthReductionValue;
        totalHealth -= totalHealthLoss;

        totalHealth = Math.Max(totalHealth, 0);

        return totalHealth;
    }
}
