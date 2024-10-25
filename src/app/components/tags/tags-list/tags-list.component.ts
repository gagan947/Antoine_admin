import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { ModelComponent } from '../../shared/model/model.component';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.css'
})
export class TagsListComponent {
  data: any;
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  pageSizeOptions = [5, 10, 25, 50];
  deleteId: any;
  loading: boolean = false

  constructor(
    private toastr: ToastrService,
    private service: SharedService,
  ) { }

  ngOnInit() {
    this.getTags()
  }

  getTags() {
    this.loading = true
    let apiUrl = `tag/get-all/?page=${this.currentPage}&limit=${this.pageSize}`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.tagAll
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
    this.getTags();
  }

  changePageSize(newPageSize: number) {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.getTags();
  }

  @ViewChild('modal') modal!: ModelComponent;

  openModal(id: any) {
    this.deleteId = id
    this.modal.open();
  }

  onModalConfirm() {
    this.loading = true
    let apiUrl = `tag/delete/?id=${this.deleteId}`
    this.service.delete(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.message
        this.loading = false
        this.getTags()
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }
}
