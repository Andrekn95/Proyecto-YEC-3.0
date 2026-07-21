import {CanDeactivateFn} from "@angular/router";

export const exitGuard: CanDeactivateFn<any> = async (component) => {
  return await component.onExit();
}
