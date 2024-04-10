import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators,ReactiveFormsModule, FormControl,} from '@angular/forms';
import { AuthServiceService } from '../services/auth-service.service';
import { GeolocationService } from '../../services/geolocation.service';
import { UserLogin, Users } from '../interfaces/users';
import { animate, state, style, transition, trigger } from '@angular/animations';

//Por temas de de compatibilidad no puedo hacer las animaciones, este seria el codigo
//que funcionaria testado en una clone de la pagina mas pequeño
//El problema es que estas versiones no son compatibles entre sí. 
//La versión 17.1.1 de @angular/core está intentando utilizar 
//@angular/animations en la versión 17.1.1, pero la instalación 
//intenta utilizar la versión 17.0.2, lo que genera el conflicto.
//He intenado actualizarla pero se rompe todo

@Component({
  selector: 'post-register',
  standalone: true,
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
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './post-register.component.html',
  styleUrl: './post-register.component.css'
})

export class PostRegisterComponent implements OnInit {
  imageBase64 = '';
  #router=inject(Router);
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthServiceService);
  #geolocationService = inject(GeolocationService);
  saved: boolean = false;

  email = this.#fb.control('', [Validators.required,Validators.email,]);
  email2 = this.#fb.control('', [Validators.required,Validators.email,]);
  name = this.#fb.control('', [Validators.required,]);
  password = this.#fb.control('', [Validators.required,Validators.minLength(4),]);
  avatar = this.#fb.control('', [Validators.required,]);
  lat= this.#fb.control(0);
  lng= this.#fb.control(0);

  ngOnInit(): void {
    this.obtainGeolocation();
  } 

  // async obtainGeolocation() {
  //   const coords = await this.#geolocationService.getLocation();
  //   console.log(coords);
  //   this.lat.setValue(coords.latitude);
  //   this.lng.setValue(coords.longitude);
    
  // }

  formRegister = this.#fb.group({
    name: this.name,
    email: this.email,  
    email2: this.email2,  
    password: this.password,
    avatar: this.avatar,
    lat: this.lat,
    lng: this.lng,
  },{validators: this.ValidateEmail()});

  userRegister(){
    console.log(this.formRegister.value['avatar']);
    const userRegister: Users = {
      ...this.formRegister.getRawValue(),
      avatar: this.imageBase64,
    };

    // this.#authService.register(userRegister).subscribe({
    //   next: () => {
    //     this.#router.navigate(['/login']);
    //   },
    //   error: (error) => console.error(error),
    // }); 
    
    this.#authService.register(userRegister).subscribe({
      next: () => {
        this.saved = true;
        this.#router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'There was an error during registration!',
        });
      },
    });
  }

  obtainGeolocation() {
    this.#geolocationService.getLocation()
      .then((coords) => {
        console.log(coords);
        this.lat.setValue(coords.latitude);
        this.lng.setValue(coords.longitude);
      })
      .catch((error) => {
        console.error('Error obtaining geolocation:', error);
        Swal.fire({
          icon: 'error',
          title: 'Geolocation Error',
          text: 'There was an error obtaining the geolocation. Please try again later.',
        });
      });
  }

  canDeactivate() {
    return (
      !this.formRegister.dirty ||
      this.saved ||
      confirm('Do you want to leave this page?. Changes canbe lost')
    );
  }

  ShowImage(event: Event) {
    this.imageBase64 = '';
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.imageBase64 = reader.result as string;
      //console.log(this.imageBase64);
    });
  }

  validClasses(control: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }

  ValidateEmail():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.get('email')?.value;
      const email2 = control.get('email2')?.value;
      if (email != email2) {
        return { email: true };
      }
      return null;      
    };
  }

}
