import type {Signal} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';

export function debouncedSignal<T>(
    source: Signal<T>,
    ms: number = 500
): Signal<T> {
    return toSignal(
        toObservable(source).pipe(
            debounceTime(ms),
            distinctUntilChanged()
        ),
        { initialValue: source() }
    );
}
