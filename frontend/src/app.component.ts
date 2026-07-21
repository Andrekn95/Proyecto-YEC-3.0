import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppService, CustomMessageService} from "@utils/services";
import {MessageModalComponent} from "@utils/components/message-modal/message-modal.component";
import {Toast} from "primeng/toast";
import {ConfirmDialog} from "primeng/confirmdialog";
import {MessageProcessingComponent} from "@utils/components/message-processing/message-processing.component";
import {AuthService} from "@modules/auth/auth.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, MessageModalComponent, Toast, ConfirmDialog, MessageProcessingComponent],
    template: `
        <!-- show a modal for http response -->
        @if (coreService.processing()) {
            <app-message-processing/>
        }

        <!-- show a modal for custom messages -->
        @if (customMessageService.modalVisible()) {
            <app-message-modal/>
        }

        <!-- show a toast for custom messages (http response) -->
        <p-toast position="top-center" [life]="customMessageService.modalLife"/>

        <!-- show a confirm modal for custom messages (ex. delete) -->
        <p-confirmDialog key="confirmdialog"></p-confirmDialog>

        <!-- render components -->
        @if (loading()) {
            <router-outlet/>
        }`
})
export class AppComponent implements OnInit {
    protected readonly authService = inject(AuthService);
    protected readonly coreService = inject(AppService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected loading = signal(true);

    ngOnInit() {
        this.authService.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4ZTc4MDZiLWRhYzYtNDJlYi04NTQzLTNjODBmYWQyMTUyNiIsInVzZXJuYW1lIjoiam9yZ2UubWluZGEiLCJpYXQiOjE3ODQ1ODkwNjQsImV4cCI6MTc4NTE5Mzg2NH0.K9rP-DO5-AG-7VSm7K9cRlAtfvIIXhbyGCerY5UAiUM";
    }
}
