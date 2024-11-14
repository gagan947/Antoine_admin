import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-downloaded-images',
  templateUrl: './downloaded-images.component.html',
  styleUrl: './downloaded-images.component.css'
})
export class DownloadedImagesComponent {
  data: any[] = [];
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  pageSizeOptions = [5, 10, 25, 50];
  paramId: any;

  constructor(
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.paramId = params['id']
    });
  }

  searchQuery: any = '';

  ngOnInit() {
    this.getList()
  }

  getList() {
    let apiUrl = `image-log/getalliamgelog-byuserid?user_id=${this.paramId}`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.logsData
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getList();
  }

  changePageSize(newPageSize: number) {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.getList();
  }
}
