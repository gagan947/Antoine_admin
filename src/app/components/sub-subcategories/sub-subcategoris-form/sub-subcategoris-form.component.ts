import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NoWhitespaceDirective } from '../../../validators';

@Component({
  selector: 'app-sub-subcategoris-form',
  templateUrl: './sub-subcategoris-form.component.html',
  styleUrl: './sub-subcategoris-form.component.css'
})
export class SubSubcategorisFormComponent {
  form: FormGroup
  paramId: any
  data: any;
  subcategoryData: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, NoWhitespaceDirective.validate]],
      category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
    })

    this.route.queryParams.subscribe((params) => {
      this.paramId = params['id']
    });
  }

  ngOnInit() {
    this.getCategories()
    if (this.paramId) {
      this.getById()
    }
  }

  onSubmit(form: any) {
    form.markAllAsTouched()
    if (form.invalid) {
      return
    }
    let apiUrl = ''
    let formData = new URLSearchParams()
    if (this.paramId) {
      apiUrl = `subcategory/update-subcategory`
      formData.set('id', this.paramId)
      formData.set('sub_subcategory_name', form.value.name)
      formData.set('subCategory_id', form.value.sub_category)
    } else {
      apiUrl = `subcategory/create-sub-subCategory`
      formData.set('sub_subcategory_name', form.value.name)
      formData.set('subCategory_id', form.value.sub_category)
    }

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.router.navigate(['/sub-subcategories'])
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getErrorMessage(field: string) {
    const control = this.form.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    }
    return ''
  }

  getById() {
    let apiurl = `subcategory/get-id?id=${this.paramId}`
    this.service.get(apiurl).subscribe(res => {
      if (res.success) {
        const data = res.subcategoryData
        this.form.patchValue(
          {
            name: data.subcategory_name,
            category: data.category_id,
          }
        )
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getCategories() {
    let apiUrl = `category/get-all`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.categoryAll
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  onCategoryChange(event: any) {
    let apiUrl = `subcategory/getsubcategory-categoryid?category_id=${event.target.value}`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.subcategoryData = res.data.subcategoryData
      } else {
        this.toastr.error(res.message)
      }
    })
  }
}
