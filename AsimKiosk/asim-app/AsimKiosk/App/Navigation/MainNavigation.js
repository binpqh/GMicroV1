import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../Containers/Home/HomeScreen';
import { ChooseServicesScreen, ChooseTypeServicesScreen } from '../Containers/Services';
import { SelectPaymentMethodScreen, PaymentCardScreen, PaymentSuccess, ErrorPayment } from '../Containers/Payment';
import { CollectSimCard, ErrorReturnCard } from '../Containers/CollectSimCard';
import { PrintInvoiceScreen } from '../Containers/PrintInvoice';
import { createStackNavigator } from '@react-navigation/stack';
import { RattingScreen } from '../Containers/Ratting';
import { ErrorsPrint, MaintenanceScreen } from '../Containers/Errors';
const Stack = createStackNavigator();
function MainNavigation() {
  return (
    <NavigationContainer
      initialRouteName="Home"
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChooseServicesScreen" component={ChooseServicesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChooseTypeServicesScreen" component={ChooseTypeServicesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SelectPaymentMethodScreen" component={SelectPaymentMethodScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PaymentCardScreen" component={PaymentCardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ErrorPayment" component={ErrorPayment} options={{ headerShown: false }} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{ headerShown: false }} />
        <Stack.Screen name="CollectSimCard" component={CollectSimCard} options={{ headerShown: false }} />
        <Stack.Screen name="ErrorReturnCard" component={ErrorReturnCard} options={{ headerShown: false }} />
        <Stack.Screen name="PrintInvoiceScreen" component={PrintInvoiceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ErrorsPrint" component={ErrorsPrint} options={{ headerShown: false }} />
        <Stack.Screen name="RattingScreen" component={RattingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MaintenanceScreen" component={MaintenanceScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigation;