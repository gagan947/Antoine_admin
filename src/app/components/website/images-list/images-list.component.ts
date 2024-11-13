import { Component, HostListener, ViewChild } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModelComponent } from '../../shared/model/model.component';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrl: './images-list.component.css'
})
export class ImagesListComponent {
  data: any[] = [];
  loading: boolean = false;
  offset = 0;
  limit = 10;
  deleteId: any;
  userData: any;
  permissionObject: any;
  searchQuery: any = '';

  constructor(
    private service: SharedService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    const userDataString: any = localStorage.getItem('userData');

    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
        if (this.userData.permission) {
          const parsedPermissions = JSON.parse(this.userData.permission);
          this.permissionObject = parsedPermissions.reduce((acc: any, curr: any) => {
            return { ...acc, ...curr };
          }, {});
        }
      } catch (error) {
        console.error('Error parsing userData or permission', error);
      }
    }
  }

  ngOnInit() {
    this.getImages()
  }

  getImages(): void {
    this.loading = true;
    const apiUrl = `website-images/get-websiteimages?website_category_id=null&website_subcategory_id=null&limit=${this.limit}&offset=${this.offset}&imageSearch=${this.searchQuery}`;

    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        if (this.offset === 0) {
          this.data = res.data.findImage;
        } else {
          this.data = [...this.data, ...res.data.findImage];
        }
        this.offset += this.limit;
      }
      this.loading = false;
    });
  }

  search() {
    this.offset = 0;
    this.data = [];
    this.getImages();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const threshold = 300;
    const position = window.pageYOffset + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (position > height - threshold && !this.loading) {
      this.getImages();
    }
  }

  @ViewChild('modal') modal!: ModelComponent;

  openModal(id: any) {
    this.deleteId = id
    this.modal.open();
  }

  onModalConfirm() {
    this.loading = true
    let apiUrl = `website-images/websiteImageDelete-byid?id=${this.deleteId}`
    this.service.delete(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = []
        this.loading = false
        this.toastr.success(res.message)
        this.offset = 0;
        this.limit = 10;
        this.getImages()
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }
}
