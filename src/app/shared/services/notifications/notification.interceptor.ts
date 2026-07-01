import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { NotificationFormRegistry } from './notification-form-registry.service';
import { NotificationChangeDetectorService } from './notification-change-detector.service';
import { NotificationSectionMapService } from './notification-section-map.service';
import { NotificationService } from './notification.service';
import { OnboardingService } from '../../../onboarding/services/onboarding.service';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {

    private registry = inject(NotificationFormRegistry);
    private detector = inject(NotificationChangeDetectorService);
    private sectionMap = inject(NotificationSectionMapService);
    private notificationService = inject(NotificationService);
    private onboardingService = inject(OnboardingService);

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const form = this.registry.getCurrentForm();
        if (!form) return next.handle(req);

        const initial = this.registry.getInitialValue();

        const currentData = req.body?.data;
        if (!currentData) return next.handle(req);

        return next.handle(req).pipe(
            tap({
                next: (event) => {


                    if (!(event instanceof HttpResponse)) return;
                    if (event.status !== 200) return;
                    if (event.body?.status === 'FAILED') return;

                    const initialData = initial?.data ?? {};

                    const notifications: string[] = [];

                    const listsToAudit = [
                        'addressList',
                        'telephones',
                        'emails',
                        'residenceList',
                        'postalAddress'
                    ];

                    listsToAudit.forEach(listName => {
                        const baseEnum = this.sectionMap.enumForList(listName);
                        if (!baseEnum) return;

                        const initialArr = initialData[listName] ?? [];
                        const currentArr = currentData[listName] ?? [];

                        const { created, updated, down } =
                            this.detector.detectArrayChanges(initialArr, currentArr);

                        if (created) notifications.push(`${baseEnum}_CREATED`);
                        if (updated) notifications.push(`${baseEnum}_UPDATE`);
                        if (down) notifications.push(`${baseEnum}_DOWN`);
                    });

                    if (notifications.length === 0) return;

                    const payload = {
                        clientId : this.onboardingService.getCurrentInfo().clientId.toString(),
                        accountId: this.onboardingService.getCurrentInfo().accountId.toString(),
                        notifications
                    };

                    console.log('NOTIFICATION PAYLOAD FINAL:', payload);

                    this.notificationService
                        .sendNotifications('notifications', payload)
                        .subscribe();

                },

                error: () => {
                    return;
                }
            })
        );
    }
}