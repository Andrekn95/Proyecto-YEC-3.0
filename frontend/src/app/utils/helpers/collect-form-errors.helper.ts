interface FormArrayComponent {
    toArray(): HasFormErrors[];
}

interface HasFormErrors {
    getFormErrors(): string[];
}

export function collectFormErrors(components: FormArrayComponent[]): string[] {
    return components
        .flatMap((component:FormArrayComponent):HasFormErrors[] => component.toArray())
        .flatMap((child:HasFormErrors):string[] => child.getFormErrors());
}
