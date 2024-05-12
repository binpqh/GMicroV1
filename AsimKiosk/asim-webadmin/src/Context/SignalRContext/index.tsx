import { createContext } from 'react';
import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const URL =
  import.meta.env.VITE_HUB_ADDRESS ?? `http://103.107.182.5:9601/KioskHub`;

interface ISignalRContext {
  connection: SingalListner | null;
  setConnection: (connection: SingalListner) => void;
}

export const SignalRContext = createContext<ISignalRContext>({
  connection: null,
  setConnection: () => {},
});

export class SingalListner {
  static onChanged: boolean = false;

  public HubConnection: signalR.HubConnection | null;
  public commandReceived: (data: any) => void = () => {};
  public isConnected: boolean = false;
  public accessTokenFactory: string | '' = '';
  public userId: string | null = null;
  constructor() {
    this.HubConnection = null;
  }

  public accessTokenFactory2 = (): string => this.accessTokenFactory;

  public async registerUser(
    userId: string | null,
    accessTokenFactory: string | ''
  ) {
    if (userId && this.HubConnection === null) {
      console.log('Inside registerUser');
      this.userId = userId;
      this.accessTokenFactory = accessTokenFactory;
      const url = URL + `?userId=${this.userId}`;

      this.HubConnection = new HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect([10000, 10000, 10000, 10000])
        .configureLogging(LogLevel.Information)
        .build();
      this.registerEventListener();
      this.HubConnection?.start()
        .then(() => {
          this.isConnected = true;
          //this.HubConnection?.invoke('ReceiveUserIdentifier', this.userId);
          this.HubConnection?.invoke('KioskOnline');
        })
        .catch((error) => {
          this.isConnected = false;
        });
    }
  }

  public registerEventListener() {
    this.HubConnection?.on('receivekiosksonline', (data) => {
      this.commandReceived(data);
      SingalListner.onChanged = !SingalListner.onChanged;
    });
  }
}
