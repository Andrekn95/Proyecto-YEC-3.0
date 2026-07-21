import {Component, computed, inject} from '@angular/core';
import {CustomMessageService} from '@utils/services/custom-message.service';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {CustomIcons} from "@utils/icons/custom-icons";
import {Divider} from "primeng/divider";


@Component({
    selector: 'app-message-modal',
    templateUrl: './message-modal.component.html',
    imports: [Dialog, Button, Divider],
    standalone: true
})
export class MessageModalComponent {
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly Array = Array;

    protected readonly CustomIcons = CustomIcons;

    groupedMessages = computed(() => {
        const messages = this.customMessageService.modalMessage;

        if (!Array.isArray(messages)) {
            return [];
        }

        const grouped = new Map<string, string[]>();

        for (const item of messages) {
            if (!grouped.has(item.label)) {
                grouped.set(item.label, []);
            }

            grouped.get(item.label)!.push(item.message);
        }

        return Array.from(grouped.entries()).map(([label, errors]) => ({
            label,
            errors
        }));
    });
}
