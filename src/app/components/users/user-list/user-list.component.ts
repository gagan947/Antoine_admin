import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  data: any[] = [];
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  pageSizeOptions = [5, 10, 25, 50];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router
  ) { }

  searchQuery: any = '';

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    let apiUrl = `user/get-alluser?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}`
    this.service.get(apiUrl).subscribe(res => {
      if (res.status == 200) {
        this.data = res.allUsers
        this.totalPages = res.pagination.totalPages
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getUsers();
  }

  changePageSize(newPageSize: number) {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.getUsers();
  }

  formatPermissions(permission: string): string {
    if (!permission) return 'N/A';
    try {
      let cleanedPermission = permission.replace(/'/g, '"').replace(/([{,])(\w+):/g, '$1"$2":');
      const permissionsArray = JSON.parse(cleanedPermission);
      const truePermissions = permissionsArray.filter((perm: any) => {
        return Object.values(perm)[0] === true;
      });
      return truePermissions.map((perm: {}) => Object.keys(perm)[0]).join(', ') || 'N/A';

    } catch (error) {
      return 'Invalid Permissions';
    }
  }

  toggleStatus(item: any): void {

    item.status = item.status === '1' ? '0' : '1';
    let apiUrl = `user/update-status`

    let formData = new URLSearchParams()
    formData.set('id', item.id)
    formData.set('status', item.status)

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
      } else {
        this.toastr.error(res.message)
      }
    })
  }
}