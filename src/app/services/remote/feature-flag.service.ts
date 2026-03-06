import { Injectable } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { fetchAndActivate, getRemoteConfig, getValue, RemoteConfig } from 'firebase/remote-config';
import { firebaseConfig } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private readonly fallbackFlags: Record<string, boolean> = {
    enable_categories: false,
  };

  private readonly remoteConfig: RemoteConfig;

  constructor() {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

    this.remoteConfig = getRemoteConfig(app);
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 0,
      fetchTimeoutMillis: 60000,
    };

    this.remoteConfig.defaultConfig = {
      enable_categories: this.fallbackFlags['enable_categories'],
    };
  }

  async getFeatureFlag(flagName: string): Promise<boolean> {
    const fallback = this.fallbackFlags[flagName] ?? false;

    try {
      await fetchAndActivate(this.remoteConfig);
    } catch {
      // Fallback to cached/default values when network fails.
    }

    try {
      return getValue(this.remoteConfig, flagName).asBoolean();
    } catch {
      return fallback;
    }
  }
}
