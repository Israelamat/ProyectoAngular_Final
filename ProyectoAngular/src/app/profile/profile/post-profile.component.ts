import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../auth/services/auth-service.service';
import { ServicesProfileService } from '../services/services-profile.service';
import {
  UserAvatarEdit,
  UserPasswordEdit,
  UserProfileEdit,
} from '../../auth/interfaces/users';
import { HttpClient } from '@angular/common/http';
import { UserResponse } from '../../interfaces/responses';
import { Coordinates } from '../../bingmaps/coordinates';
import { BmMapDirective } from '../../bingmaps/bm-map.directive';
import { BmMarkerDirective } from '../../bingmaps/bm-marker.directive';
import { BmAutosuggestDirective } from '../../bingmaps/bm-autosuggest.directive';

@Component({
  selector: 'post-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    BmMapDirective,
    BmMarkerDirective,
    BmAutosuggestDirective,
  ],
  templateUrl: './post-profile.component.html',
  styleUrl: './post-profile.component.css',
})
export class PostProfileComponent implements OnInit {
  @Input() id!: number;
  #fb = inject(NonNullableFormBuilder);
  profileForm: boolean = false;
  passwordForm2: boolean = false;
  #router = inject(Router);
  #serviceService = inject(ServicesProfileService);
  profile: boolean = false;
  coordinates!: Coordinates;
  saved: boolean = false;


  email = this.#fb.control('', [Validators.email, Validators.required]);
  name = this.#fb.control('', [Validators.required, Validators.minLength(4)]);

  emailName = this.#fb.group({
    email: this.email,
    name: this.name,
  });

  password = this.#fb.control('',[Validators.required, Validators.minLength(4)]);
  password2 = this.#fb.control('',[Validators.required, Validators.minLength(4)]);

  passwordForm = this.#fb.group({
    password: this.password,
    password2: this.password2,
  });

  toggleProfileForm() {
    this.profileForm = !this.profileForm;
    this.passwordForm2 = false;
  }

  togglePaswordForm() {
    this.passwordForm2 = !this.passwordForm2;
    this.profileForm = false;
  }

  onSubmitEmailName() {
    if (this.emailName.valid) {
      const email = this.emailName.value.email;
      const name = this.emailName.value.name;

      const user: UserProfileEdit = {
        email: email,
        name: name,
      };

      this.#serviceService.saveProfile(user).subscribe(
        () => {
        //   this.#router.navigate(['/profile']);
        location.reload();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.value.password;
      const password2 = this.passwordForm.value.password2;

      if (password?.toUpperCase() === password2?.toUpperCase()) {
        const user: UserPasswordEdit = {
          password: password,
        };

        this.#serviceService.savePassword(user).subscribe(
          () => {
            // this.#router.navigate(['/profile']);
            location.reload();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
  }

  onAvatarChange(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);

      reader.onload = () => {
        const avatar: UserAvatarEdit = {
          avatar: reader.result as string,
        };

        this.#serviceService.saveAvatar(avatar).subscribe(
          () => {
            // this.#router.navigate(['/profile']);
            location.reload();
          },
          (err) => {
            console.log(err);
          }
        );
      };
    }
  }

  user!: UserResponse;

  ngOnInit() {
      if (!this.id) {
        this.#serviceService.getMyUser().subscribe({
          next: (user) => {
            this.user = user;
            this.profile = true;
            this.coordinates = {
              latitude: user.user.lat,
              longitude: user.user.lng,
            };
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.#serviceService.getProfile(this.id).subscribe({
          next: (user) => {
            this.user = user;
            this.coordinates = {
              latitude: user.user.lat,
              longitude: user.user.lng,
            };
            this.#serviceService.getMyUser().subscribe({
              next: (myUser) => {
                if (myUser.user.id == user.user.id) {
                  this.profile = true;
                }
                else {
                  this.profile = false;
                }
              },
              error: (err) => {
                console.log(err);
              },
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
  }

  moveMap(coords: Coordinates) {
    this.coordinates = coords;
  }

  validClasses(control: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }

  canDeactivate() {
    return (
      (!this.emailName.dirty && !this.passwordForm.dirty) ||
      this.saved ||
      confirm('Do you want to leave this page? Changes can be lost')
    );
  }
  

  loginRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.get('email')?.value;
      const password = control.get('password')?.value;
     
      if (!email && !password ) {
        return { required: true };
      } else {
        return null;
      }
    };
  }
  
}
