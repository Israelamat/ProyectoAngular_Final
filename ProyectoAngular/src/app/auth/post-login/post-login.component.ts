import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {FormsModule,NonNullableFormBuilder,Validators, ReactiveFormsModule,
  FormControl,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

import Swal from 'sweetalert2';

import { UserLogin } from '../interfaces/users';
import { AuthServiceService } from '../services/auth-service.service';
import { GeolocationService } from '../../services/geolocation.service';
import { LoadGoogleApiService } from '../../google-login/load-google-api.service';
import { Subscription } from 'rxjs';
import { GoogleLoginDirective } from '../../google-login/google-login.directive';
import { FbLoginDirective } from '../../facebook-login/fb-login.directive';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Token } from '@angular/compiler';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'post-login',
  animations: [
    trigger("enterState", [
      state("void", style({
        transform: "translateX(0)",
        opacity: 0
      })),
      transition(":enter",[
        animate(300, style({
          transform: "translateX(0)",
          opacity: 1
        }))
      ])
    ])
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,GoogleLoginDirective,FbLoginDirective,FontAwesomeModule,RouterLink],
  templateUrl: './post-login.component.html',
  styleUrl: './post-login.component.css',
})
export class PostLoginComponent implements OnInit,OnDestroy {
  state: string = 'start';
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthServiceService);
  #geolocationService = inject(GeolocationService);
  saved: boolean = false;
  #loadGoogle = inject(LoadGoogleApiService);
  iconFacebook = faFacebook;
  #ngZOne = inject(NgZone);
  iconGoogle = faGoogle;
  credentialsSub!: Subscription;
  validarContrasena: boolean = true;

  ngOnInit(): void {
    this.obtainGeolocation();    
    this.credentialsSub = this.#loadGoogle.credential$.subscribe(
      (resp) => {
        this.#authService.loginGoogle(resp.credential!).subscribe({
          next: () => {
           this.#ngZOne.run(() => this.#router.navigate(['/posts']));
          },
          error: (error) => {
            console.log(error);
            this.validarContrasena = false;
          },
        });
      }       
    );
  }

  loggedFacebook(resp: fb.StatusResponse) {
    this.#authService.loginFacebook(resp.authResponse.accessToken!).subscribe({
      next: () => {
        this.#router.navigate(['/posts']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  showError(error: any) {
    console.error(`${error}`);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Incorrect Login',
    });
    console.log('End of error function');
  }
  

  lat = 0;
  lng = 0;

  async obtainGeolocation() {
    const coords = await this.#geolocationService.getLocation();
    this.lat = coords.latitude;
    this.lng = coords.longitude;
  }

  email = this.#fb.control('', [Validators.required, Validators.email]);

  password = this.#fb.control('', [
    Validators.required,
    Validators.minLength(4),
  ]);

  loginForm = this.#fb.group(
    {
      email: this.email,
      password: this.password,
    },
    { validators: this.loginRequired() }
  );

  onSubmit() {
    console.log('Form is valid');
      this.state = this.state === 'start' ? 'end' : 'start';
      const userPost: UserLogin = {
        ...this.loginForm.getRawValue(),
        lat: this.lat,
        lng: this.lng,
      };
      this.#authService.login(userPost).subscribe({
        next: () => {
          this.#router.navigate(['/posts']);
        },
        error: (error) => {
          console.log(error);
          this.showError(error);
        },
      });
  }

  validClasses(control: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }

  canDeactivate() {
    return (
      !this.loginForm.dirty ||
      this.saved ||
      confirm('Do you want to leave this page?. Changes canbe lost')
    );
  }

  loginRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.get('email')?.value;
      const password = control.get('password')?.value;

      if (!email && !password) {
        return { required: true };
      } else {
        return null;
      }
    };
  }

  ngOnDestroy(): void {
    this.credentialsSub.unsubscribe();
  }

  goBack() {
    this.#router.navigate(['/posts']);
  }
}
