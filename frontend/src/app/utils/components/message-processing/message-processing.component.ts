import {Component, inject} from '@angular/core';
import {CustomMessageService} from '@utils/services/custom-message.service';
import {Dialog} from 'primeng/dialog';
import {ProgressBar} from 'primeng/progressbar';

@Component({
    selector: 'app-message-processing',
    templateUrl: './message-processing.component.html',
    imports: [Dialog, ProgressBar],
    standalone: true
})
export class MessageProcessingComponent {
    protected readonly customMessageService = inject(CustomMessageService);
}
