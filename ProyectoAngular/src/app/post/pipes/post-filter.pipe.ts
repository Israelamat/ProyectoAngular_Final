import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../../interfaces/post';

@Pipe({  name: 'postFilter',  standalone: true,})

export class PostFilterPipe implements PipeTransform {

  transform(products: Post[], search: string): Post[] {
    if (!search) return products;
    
    return products.filter((p) =>
    (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );
  }
}  