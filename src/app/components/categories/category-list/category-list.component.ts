import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { ModelComponent } from '../../shared/model/model.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  data: any;
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  pageSizeOptions = [5, 10, 25, 50];
  deleteId: any;
  loading: boolean = false

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router
  ) { }

  searchQuery: any = '';
  
  ngOnInit() {
    this.getCategories()
  }

  getCategories() {
    this.loading = true
    let apiUrl = `category/get-all/?page=${this.currentPage}&limit=${this.pageSize}&search=${this.searchQuery}`
    this.service.get(apiUrl).subscribe(res => {
      if (res.status == 200) {
        debugger
        this.data = res.categoryAll
        this.totalPages = res.pagination.totalPages
        this.loading = false
      } else {
        //this.toastr.error(res.message)
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
    let apiUrl = `category/delete/?id=${this.deleteId}`
    this.service.delete(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.message
        this.loading = false
        this.getCategories()
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }
}
