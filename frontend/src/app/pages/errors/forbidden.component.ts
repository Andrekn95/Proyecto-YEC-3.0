import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { environment } from '@env/environment';
import { AuthService } from '@modules/auth/auth.service';
import { MY_ROUTES } from '@routes';
import { FontAwesome } from '@modules/public/icons/font-awesome';
import { Fluid } from 'primeng/fluid';
import { Divider } from 'primeng/divider';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-forbidden',
    standalone: true,
    imports: [RouterModule, ButtonModule, Fluid, Divider, NgClass],
    styles: [
        `
            .icon-color {
                color: var(--p-red-600);
            }
        `
    ],
    template: `
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="w-full mx-auto max-w-3xl">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--p-red-600), transparent 50%) 10%, var(--surface-ground) 90%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 flex flex-col items-center" style="border-radius: 53px">
                        <p-fluid>
                            <div class="custom-form-grid">
                                <div class="col-span-12 flex flex-row justify-center items-center gap-6 text-center">
                                    <i [ngClass]="[FontAwesome.ICON_4_SOLID, 'fa-6x', 'icon-color']"></i>
                                    <i [ngClass]="[FontAwesome.SHIELD_DOG_SOLID, 'fa-6x', 'icon-color']"></i>
                                    <i [ngClass]="[FontAwesome.ICON_3_SOLID, 'fa-6x', 'icon-color']"></i>
                                </div>

                                <div class="custom-form-field col-span-12 text-center">
                                    <p-divider />
                                    <h2 style="color: var(--p-red-600);" class="mt-4 mb-4">¡Acceso Restringido!</h2>
                                    <p-divider />
                                </div>

                                <div class="custom-form-field col-span-12 text-center mb-4">
                                    <h4 style="color: var(--p-gray-500);">No tienes los permisos necesarios</h4>
                                    <p style="color: var(--p-gray-400);">Lo sentimos, tu perfil actual no te permite realizar esta acción o ver este contenido.</p>
                                    <p-divider />
                                </div>

                                <div class="custom-form-field md:col-span-6">
                                    <p-button label="Regresar" styleClass="w-full" [icon]="FontAwesome.CHEVRON_LEFT_SOLID" [raised]="true" severity="danger" (onClick)="back()" />
                                </div>

                                <div class="custom-form-field md:col-span-6">
                                    <p-button label="Contactar" styleClass="w-full" [icon]="FontAwesome.ENVELOPE_OPEN_TEXT_SOLID" [text]="true" [raised]="true" severity="secondary" (onClick)="back()" />
                                </div>
                            </div>
                        </p-fluid>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ForbiddenComponent {
    protected readonly environment = environment;
    protected readonly authService = inject(AuthService);
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly FontAwesome = FontAwesome;
    private readonly router = inject(Router);

    back() {
        this.router.navigate(['/']);
    }
}
