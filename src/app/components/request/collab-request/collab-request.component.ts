import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collab-request',
  templateUrl: './collab-request.component.html',
  styleUrl: './collab-request.component.css'
})
export class CollabRequestComponent {
  data: any[] = [];
  loading: boolean = false;
  deleteId: any;
  userData: any;
  permissionObject: any;
  constructor(
    private service: SharedService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    const userDataString: any = localStorage.getItem('adminData');

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
    const apiUrl = `image/admin-getusercollaburateimages`;

    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.data;
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  changeStatus(img_id: any, status: number): void {
    let apiUrl = `image/admin-updateusercollaburateimagestatus`

    let formData = new URLSearchParams()
    formData.set('image_id', img_id)
    formData.set('collaburate_status', status.toString())

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.getImages()
      } else {
        this.toastr.error(res.message)
      }
    })
  }
}