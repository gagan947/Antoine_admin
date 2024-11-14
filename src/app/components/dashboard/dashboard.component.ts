import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  data: any;
  loading: boolean = false
  userData: any;
  permissionObject: any;

  constructor(
    private toastr: ToastrService,
    private service: SharedService,
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

  searchQuery: any = '';

  ngOnInit() {
    this.getDashboardData()
  }

  getDashboardData() {
    this.loading = true
    let apiUrl = `user/total-usersposts`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.dataCount
        this.loading = false
      } else {
        //this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  getRoleLabel(id: any): string {
    switch (id) {
      case '1':
        return 'Sub Admin'
      case '2':
        return 'Collaborator'
      case '3':
        return 'User'
      default:
        return 'Unknown'
    }
  }

  changeStatus(event: any, user_id: any) {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set('verify_status', event.target.value)
    formData.set('user_id', user_id)

    let apiUrl = `user/update-verifystatus`
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.getDashboardData()
        this.loading = false
      } else {
        //this.toastr.error(res.message)
        this.loading = false
      }
    })
  }
}
