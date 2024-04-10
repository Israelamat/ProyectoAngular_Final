import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { PostInsert } from '../../interfaces/post';
import { CommonModule } from '@angular/common';
import {AbstractControl, FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule,
  ValidationErrors,ValidatorFn, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostsServiceService } from '../services/posts-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BmMapDirective } from '../../bingmaps/bm-map.directive';
import { BmMarkerDirective } from '../../bingmaps/bm-marker.directive';
import { BmAutosuggestDirective } from '../../bingmaps/bm-autosuggest.directive';
import { Coordinates } from '../../bingmaps/coordinates';
import { GeolocationService } from '../../services/geolocation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'post-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BmMapDirective,
    BmMarkerDirective,
    BmAutosuggestDirective,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent implements OnInit {
  @Output() add = new EventEmitter<PostInsert>();
  imagenName!: string;
  #postsService = inject(PostsServiceService);
  #router = inject(Router);
  saved: boolean = false;
  imageBase64 = '';
  #fb = inject(NonNullableFormBuilder);
  iditPost: boolean = false;
  coordinates!: Coordinates;
  #geolocationService = inject(GeolocationService);
  
  addPost() { 
    const postId = Number(this.route.snapshot.params['id']);
    let post: PostInsert;

    if(this.postForm.get('eleccion')?.value === 'location'){
      post= {
        ...this.postForm.getRawValue(),
        image: this.imageBase64,
        mood: Number(this.mood.value),
        date: String(new Date()),
        likes: null,
        lat: this.coordinates.latitude,
        lng: this.coordinates.longitude,
      };
    }else {
      post= {
        ...this.postForm.getRawValue(),
        image: this.imageBase64,
        mood: Number(this.mood.value),
        date: String(new Date()),
        likes: null,    
      };
    }

    if (this.iditPost === true) {
      this.#postsService.updatePost(postId, post).subscribe({
        next: () => {
          this.saved = true;
          this.#router.navigate(['/posts']);
        },
        error: (error) => console.error(error),
      });
    } else {      
        this.#postsService.addPost(post).subscribe({
          next: () => {
            this.saved = true;
            this.#router.navigate(['/posts']);
          },
          error: (error) => console.error(error),
        });      
    }
  }

  obtainGeolocation() {
    this.#geolocationService.getLocation().then(
      (coords) => {
        this.coordinates = coords;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al obtener la ubicación.',
        });
        console.error(error);
      }
    );
  }

  ngOnInit(): void {
    this.obtainGeolocation();
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);

      if (typeof id === 'number' && !isNaN(id)) {
        this.iditPost = true;
        this.#postsService.getPost(id).subscribe({
          next: (post) => {
            this.title.setValue(post.title!);
            this.description.setValue(post.description!);
            this.mood.setValue(post.mood!);
            this.imageBase64 = post.image!;
          },
          error: (error) => console.error(error),
        });
      } else {
        this.resetForm();
        this.iditPost = false;
      }
    });
  }

  canDeactivate() {
    return (
      !this.postForm.dirty || this.saved || confirm('Leave this page?. Changes canbe lost')
    );
  }

  

  validClasses(control: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: control.touched && control.valid,
      [errorClass]: control.touched && control.invalid,
    };
  }

  resetForm() {
    this.postForm.reset();
    this.imageBase64 = '';
  }

  ShowImage(event: Event) {
    this.imageBase64 = '';
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.imageBase64 = reader.result as string;
    });
  }

  formRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const title = control.get('title')?.value;
      const description = control.get('description')?.value;
      const image = control.get('image')?.value;

      if (!title && !description && !image) {
        return { required: true };
      } else {
        return null;
      }
    };
  }

  title = this.#fb.control('', [
    Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
    Validators.minLength(5),
  ]);

  description = this.#fb.control('', [Validators.minLength(8)]);
  mood = this.#fb.control(0);
  image = this.#fb.control('');
  date = this.#fb.control('');
  likes = this.#fb.control('');

  eleccion = this.#fb.control('photo');

  postForm = this.#fb.group(
    {
      title: this.title,
      description: this.description,
      mood: this.mood,
      image: this.image,
      date: this.date,
      likes: this.likes,
      eleccion: this.eleccion,
    },
    { validators: this.formRequired() }
  );

  constructor(private route: ActivatedRoute) {
    this.resetForm();
  }

  moveMap(coords: Coordinates) {
    this.coordinates = coords;
  }
}
