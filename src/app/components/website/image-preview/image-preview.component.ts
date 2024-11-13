import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent {
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
    let apiUrl = `website-images/websiteimage-byid?website_image_id=${this.paramId}`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.data.findImage[0]
        this.category = res.data.category
        this.category = res.data.subcategory
        this.loading = false
      } else {
        this.loading = false
      }
    })
  }
}
