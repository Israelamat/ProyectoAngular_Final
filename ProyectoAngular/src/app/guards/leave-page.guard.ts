import { CanDeactivateFn } from '@angular/router';
import { CanDeactivateComponent } from '../interfaces/can-deactivate-component';

export const leavePageGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component
) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
