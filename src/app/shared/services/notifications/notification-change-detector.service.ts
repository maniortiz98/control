import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationChangeDetectorService {

  detectArrayChanges(initialArr: any[], currentArr: any[]) {
    let created = false;
    let updated = false;
    let down = false;

    currentArr.forEach(item => {

      const oldItem = item.id
        ? initialArr.find(x => x.id === item.id)
        : null;

      if (!item.id && item.active === true) {
        created = true;
        return;
      }

      if (item.id && item.active === false) {
        down = true;
        return;
      }

      if (item.id && oldItem) {
        const changed = JSON.stringify(oldItem) !== JSON.stringify(item);
        if (changed) updated = true;
      }
    });

    return { created, updated, down };
  }
}