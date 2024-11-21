import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { ModelComponent } from '../../shared/model/model.component';

@Component({
  selector: 'app-sub-subcategoris-list',
  templateUrl: './sub-subcategoris-list.component.html',
  styleUrl: './sub-subcategoris-list.component.css'
})
export class SubSubcategorisListComponent {
  data: any;
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  pageSizeOptions = [5, 10, 25, 50];
  deleteId: any;
  loading: boolean = false
  userData: any;
  permissionObject: any;

  constructor(
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router
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

  searchQuery: any = '';

  ngOnInit() {
    this.getCategories()
  }

  getCategories() {
    this.loading = true
    let apiUrl = `subcategory/get-all/?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.subcategoryAll
        this.totalPages = res.pagination.totalPages
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getCategories();
  }

  changePageSize(newPageSize: number) {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.getCategories();
  }

  @ViewChild('modal') modal!: ModelComponent;

  openModal(id: any) {
    this.deleteId = id
    this.modal.open();
  }

  onModalConfirm() {
    this.loading = true
    let apiUrl = `subcategory/delete/?id=${this.deleteId}`
    this.service.delete(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.message
        this.loading = false
        this.toastr.success(res.message)
        this.getCategories()
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }
}
