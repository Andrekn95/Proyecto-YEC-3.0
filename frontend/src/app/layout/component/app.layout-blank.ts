import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-blank',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `<router-outlet />`
})
export default class AppLayoutBlank {}
