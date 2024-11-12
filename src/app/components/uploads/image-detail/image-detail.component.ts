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
        this.data = res.imageData.findImageProfile[0]
        this.category = res.imageData.category
        this.category = res.imageData.subcategory
        this.loading = false
      } else {
        this.loading = false
      }
    })
  }
}
