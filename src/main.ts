import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// register only the icons we actually use to avoid network-loading problems
import { addIcons } from 'ionicons';
import { trashOutline, addCircleOutline, listOutline, checkmarkDoneOutline, chevronBackOutline, chevronForwardOutline, createOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';

addIcons({
  'trash-outline': trashOutline,
  'add-circle-outline': addCircleOutline,
  'list-outline': listOutline,
  'checkmark-done-outline': checkmarkDoneOutline,
  'chevron-back-outline': chevronBackOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'create-outline': createOutline,
  'checkmark-outline': checkmarkOutline,
  'close-outline': closeOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
