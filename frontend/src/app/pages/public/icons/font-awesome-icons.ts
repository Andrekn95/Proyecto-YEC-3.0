import { Component, OnInit } from '@angular/core';
import { FontAwesome } from '@modules/public/icons/font-awesome';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Divider } from 'primeng/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-font-awesome-icons',
    imports: [Tooltip, InputText, TableModule, Divider, ReactiveFormsModule, Button],
    template: `
        <div class="card p-4">
            <h2 class="mb-4">Galería de Iconos</h2>

            <div class="flex flex-wrap gap-3 justify-content-center">
                <input pInputText type="text" [formControl]="search" class="w-full" />

                <p-divider />

                @for (icon of iconsList; track icon.name) {
                    <div style="width: 150px; height: 120px;" (click)="copyCode(icon.name)" pTooltip="Copiar código"
                         tooltipPosition="top" class="text-center">
                        <p-button [icon]="icon.css" size="large" />

                        <p-divider />

                        <p
                            class="text-xs text-500 font-bold text-center white-space-nowrap overflow-hidden text-overflow-ellipsis w-full">
                            {{ icon.name }}
                        </p>
                    </div>
                }
            </div>
        </div>
    `
})
export default class FontAwesomeIcons implements OnInit {
    allIconsList: any[] = [];
    iconsList: any[] = [];
    search = new FormControl('');

    ngOnInit() {
        this.iconsList = Object.entries(FontAwesome).map(([key, value]) => {
            return {
                name: key,
                css: value
            };
        });

        this.allIconsList = Object.entries(FontAwesome).map(([key, value]) => {
            return {
                name: key,
                css: value
            };
        });

        this.search.valueChanges.subscribe((value) => {
            if (value) this.iconsList = this.allIconsList.filter((icon) => icon.name.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(icon.css.toLowerCase()));
            else this.iconsList = this.allIconsList;
        });
    }

    copyCode(val: string) {
        navigator.clipboard.writeText(`FontAwesome.${val}`);
    }
}
