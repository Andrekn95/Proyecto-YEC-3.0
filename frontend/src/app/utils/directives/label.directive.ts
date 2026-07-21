import {
    Directive,
    ElementRef,
    Renderer2,
    inject,
    input,
    computed,
    effect,
} from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';

@Directive({
    selector: '[appLabel]',
    standalone: true,
})
export class LabelDirective<T = unknown> {
    private readonly el = inject(ElementRef<HTMLLabelElement>);
    private readonly renderer = inject(Renderer2);

    // Texto base del label
    readonly label = input.required<string>();

    // El FieldTree que le pasas desde el template, ej: [field]="formData.shortName"
    readonly field = input<FieldTree<T> | undefined>();

    // FieldState reactivo -> se recalcula cada vez que cambia el árbol de validación
    private readonly fieldState = computed(() => this.field()?.());

    // Señal directa de "requerido" que expone Signal Forms
    protected readonly isRequired = computed(() => this.fieldState()?.required() ?? false);

    constructor() {
        // effect() en el constructor => siempre dentro del injection context (evita NG0203)
        effect(() => this.render(this.isRequired()));
    }

    private render(required: boolean): void {
        // Limpiamos el contenido actual del <label>
        this.renderer.setProperty(this.el.nativeElement, 'textContent', '');

        if (required) {
            const icon = this.renderer.createElement('span');
            // this.renderer.setStyle(asterisk, 'color', 'red');
            // this.renderer.setProperty(asterisk, 'textContent', '* ');
            this.renderer.addClass(icon, 'pi');
            this.renderer.addClass(icon, 'pi-asterisk');
            this.renderer.addClass(icon, 'text-red-500');
            this.renderer.addClass(icon, 'mr-1');
            this.renderer.setStyle(icon, 'font-size', '0.6rem');
            this.renderer.appendChild(this.el.nativeElement, icon);
        }

        const textNode = this.renderer.createText(this.label());
        this.renderer.appendChild(this.el.nativeElement, textNode);
    }
}
