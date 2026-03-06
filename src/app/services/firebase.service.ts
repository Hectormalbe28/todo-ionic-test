import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { firebaseConfig } from '../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  remoteConfig;

  constructor() {

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    this.remoteConfig = getRemoteConfig(app);

    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 0,
      fetchTimeoutMillis: 60000
    };

  }

  async getFeatureFlag(flagName: string): Promise<boolean> {

    await fetchAndActivate(this.remoteConfig);

    const value = getValue(this.remoteConfig, flagName);

    return value.asBoolean();

  }

  

}