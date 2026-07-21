import { Component, inject } from '@angular/core';
import { AuthHttpService } from '../../auth-http.service';

import { CustomMessageService } from '@utils/services/custom-message.service';

@Component({
    selector: 'app-auth-provider-button',
    templateUrl: 'auth-provider-button.component.html',
    standalone: true,
    imports: []
})
export class GoogleComponent {
    private readonly _authHttpService = inject(AuthHttpService);
    private readonly _customMessageService = inject(CustomMessageService);
}
