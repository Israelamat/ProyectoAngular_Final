import { trigger, state, style, transition, animate } from '@angular/animations';

export const myAnimation = trigger('myAnimation', [
  state('start', style({
    transform: 'scale(1)',
    backgroundColor: 'green',
  })),
  state('end', style({
    transform: 'scale(1.5)',
    backgroundColor: 'red',
  })),
  transition('start <=> end', animate('500ms ease-in-out')),
]);

export const fadeInOut = trigger('fadeInOut', [
  state('start', style({
    opacity: 0,
    transform: 'translateY(-20px)'
  })),
  state('end', style({
    opacity: 1,
    transform: 'translateY(0)'
  })),
  transition('start <=> end', animate('500ms ease-in-out'))
]);

export const simpleAnimation = trigger('simpleAnimation', [
  state('start', style({
    opacity: 1,
  })),
  state('end', style({
    opacity: 0,
  })),
  transition('start <=> end', animate('500ms ease-in-out')),
]);

