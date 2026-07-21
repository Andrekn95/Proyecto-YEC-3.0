import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '@layout/service/layout.service';
import { Divider } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { environment } from '@env/environment';
import { MY_ROUTES } from '@routes';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import {CustomIcons} from "@utils/icons/custom-icons";

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, Divider, FormsModule, Message, ReactiveFormsModule, Button, Tooltip],
    styles: [
        `
            .login-page {
                /* 1. Cambiamos fixed por relative o lo quitamos para que fluya */
                position: relative;
                width: 100%;
                /* 2. Usamos min-height para que crezca con el contenido */
                min-height: 100vh;

                /* 3. Imagen de fondo */
                background-image: url('/development/auth/images/background.png');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: cover;
                background-attachment: fixed; /* Esto hace que el fondo se quede quieto mientras el formulario sube */

                /* 4. IMPORTANTE: Cambiar hidden por auto o simplemente quitarlo */
                overflow-y: auto;
            }

            .box {
                opacity: 0.95; /* Un poco más de opacidad ayuda a la lectura en formularios largos */
                margin-top: 2rem; /* Espacio opcional arriba y abajo */
                margin-bottom: 2rem;
            }

            .p-message p {
                font-size: 0.7rem;
            }

            .p-message b {
                font-size: 0.9rem;
            }

            .p-message i {
                font-size: 15px;
                padding-right: 25px;
            }
        `
    ],
    template: `
        <div class="login-page min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div
                class="box w-full max-w-7xl bg-white rounded-xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-7">
                <!-- COLUMNA IZQUIERDA -->
                <div class="lg:col-span-3 p-6 lg:p-10 flex flex-col justify-center">
                    <!-- Logo / Header -->
                    <div class="flex justify-center">
                        <img [src]="environment.APP_PATH_ASSETS + '/auth/images/logo.png'" alt="" class="mx-auto"/>
                    </div>

                    <!-- Contenido dinámico -->
                    <!-- Aquí renderizas varios componentes -->
                    <ng-content select="[left-content]">
                        <router-outlet/>
                        <p-button severity="secondary" [label]="environment.APP_VERSION" pTooltip="Versión del sistema"
                                  [icon]="CustomIcons.CODE_BRANCH_SOLID" [text]="true"/>
                    </ng-content>
                </div>

                <!-- COLUMNA DERECHA -->
                <div class="lg:col-span-4 bg-surface-50 p-6 lg:p-10 justify-center">
                    <!-- Bloque informativo superior -->
                    <div class="mb-6">
                        <ng-content select="[right-header]">
                            <div class="font-semibold text-xl text-center">{{ environment.APP_NAME }}</div>

                            <p-divider/>

                            <p-message severity="info">
                                <p>
                                    <i [class]="CustomIcons.TRIANGLE_EXCLAMATION_SOLID"></i>
                                    <b>Importante:</b> Estimado Usuario, si su establecimiento se encuentra ubicado en
                                    el cantón Quito, por favor acérquese a las oficinas de "Quito Turismo" para
                                    solicitar su Certificado de Registro Turístico.
                                </p>
                                <p>
                                    <i [class]="CustomIcons.LOCATION_DOT_SOLID"></i>
                                    <b>Dirección:</b>
                                    Parque Bicentenario, terminales del antiguo Aeropuerto de Quito.
                                </p>

                                <p>
                                    <i [class]="CustomIcons.PHONE_SOLID"></i>
                                    <b>Teléfono:</b>
                                    (02) 2993 300 <b>extensiones</b> 1003, 1035 y 1068
                                </p>

                                <p>
                                    <i [class]="CustomIcons.ENVELOPE_SOLID"></i>
                                    <b>Correo electrónico:</b> <a href="mailto:info@quito-turismo.gob.ec"> info@quito
                                    -turismo.gob.ec</a>
                                </p>
                            </p-message>
                        </ng-content>
                    </div>

                    <!-- Listado / pasos / información -->
                    <div class="space-y-6">
                        <ng-content select="[right-content]">
                            <div class="flex flex-col gap-2">
                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-1 flex flex-col gap-2">
                                        <p-button pTooltip="Ir a Simulador"
                                                  [icon]="CustomIcons.ARROW_UP_RIGHT_FROM_SQUARE_SOLID"
                                                  styleClass="w-full" severity="info" [text]="true" [raised]="true"
                                                  (onClick)="goToSimulator()"/>
                                    </div>
                                    <div class="md:col-span-11 flex flex-col gap-2">
                                        <h6 class="mb-5" style="color:var(--text-color-secondary)">Simulador de
                                            Normativa</h6>
                                        <small style="color:var(--text-color-secondary)">Permite validar si se cumple o
                                            no con los requisitos para acceder a una clasificación y categoría
                                            específica.</small>
                                    </div>
                                </div>
                                <p-divider/>

                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-1 flex flex-col gap-2">
                                        <p-button pTooltip="Descargar" [icon]="CustomIcons.DOWNLOAD_SOLID"
                                                  styleClass="w-full" [text]="true" [raised]="true"
                                                  (onClick)="downloadPDF('steps')"/>
                                    </div>
                                    <div class="md:col-span-11 flex flex-col gap-2">
                                        <h6 class="mb-5" style="color:var(--text-color-secondary)">5 Pasos para obtener
                                            un Registro de Turismo</h6>
                                    </div>
                                </div>
                                <p-divider/>

                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-1 flex flex-col gap-2">
                                        <p-button pTooltip="Descargar" [icon]="CustomIcons.DOWNLOAD_SOLID"
                                                  styleClass="w-full" [text]="true" [raised]="true"
                                                  (onClick)="downloadPDF('manual')"/>
                                    </div>
                                    <div class="md:col-span-11 flex flex-col gap-2">
                                        <h6 class="mb-5" style="color:var(--text-color-secondary)">Manual de
                                            usuario</h6>
                                    </div>
                                </div>
                                <p-divider/>

                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-1 flex flex-col gap-2">
                                        <p-button pTooltip="Descargar" [icon]="CustomIcons.DOWNLOAD_SOLID"
                                                  styleClass="w-full" [text]="true" [raised]="true"
                                                  (onClick)="downloadPDF('legal')"/>
                                    </div>
                                    <div class="md:col-span-11 flex flex-col gap-2">
                                        <h6 class="mb-5" style="color:var(--text-color-secondary)">Términos Y
                                            Condiciones</h6>
                                    </div>
                                </div>
                            </div>
                        </ng-content>
                    </div>
                </div>
            </div>
        </div>
    `
})
export default class AppLayoutAuth {
    layoutService = inject(LayoutService);
    containerClass = computed(() => {
        const config = this.layoutService.layoutConfig();
        const state = this.layoutService.layoutState();
        return {
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.mobileMenuActive
        };
    });
    protected readonly environment = environment;
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly CustomIcons = CustomIcons;
    private readonly router = inject(Router);

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });
    }

    goToSimulator() {
        window.open(this.router.serializeUrl(this.router.createUrlTree([MY_ROUTES.publicPages.simulator.absolute])), '_blank');
    }

    downloadPDF(file: string) {
        switch (file) {
            case 'steps':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/steps.pdf`, '_blank');
                break;
            case 'manual':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/manual.pdf`, '_blank');
                break;
            case 'legal':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/legal.pdf`, '_blank');
                break;
        }
    }
}
