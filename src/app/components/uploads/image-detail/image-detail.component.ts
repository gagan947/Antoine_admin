import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrl: './image-detail.component.css'
})
export class ImageDetailComponent {
  paramId: any;
  loading: boolean = false;
  data: any;
  category: any;

  constructor(
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.paramId = params['id']
    });
  }

  ngOnInit() {
    this.getAlbum()
  }

  getAlbum() {
    this.loading = true
    let apiUrl = `image/image-profile?id=${this.paramId}`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.imageData.findImageProfile
        this.category = res.imageData.category
        this.category = res.imageData.subcategory
        this.loading = false
      } else {
        this.loading = false
      }
    })
  }

  getUniqueSubAlbums(subAlbums: any[]) {
    const uniqueAlbums = subAlbums?.reduce((acc, current) => {
      const exists = acc.find(
        (item: any) =>
          item.category_id === current.category_id &&
          item.subcategory_id === current.subcategory_id &&
          item.sub_sub_categoryName === current.sub_sub_categoryName
      );
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
    return uniqueAlbums;
  }
}
