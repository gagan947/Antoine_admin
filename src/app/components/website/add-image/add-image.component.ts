import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NoWhitespaceDirective } from '../../../validators';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrl: './add-image.component.css'
})
export class AddImageComponent {
  form: FormGroup
  paramId: any
  data: any;
  subCategories: any;
  editor!: Editor;
  uploadedImages: string[] = []; // Store the array of already uploaded image URLs
  selectedImages: File[] = [];
  selectedType: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: [''],
      category: ['', Validators.required],
      sub_category: [''],
      file: ['', Validators.required],
      description: [''],
    })

    this.updateValidators();

    this.route.queryParams.subscribe((params) => {
      this.paramId = params['id']
    });
  }


  ngOnInit() {
    this.editor = new Editor();
    this.getCategories()
    if (this.paramId) {
      this.getById()
    }
  }

  updateValidators() {
    if (this.selectedType === 'NEWS') {
      this.form.get('title')?.setValidators([Validators.required]);
      this.form.get('description')?.setValidators([Validators.required]);
      this.form.get('sub_category')?.clearValidators();
    } else {
      this.form.get('title')?.clearValidators();
      this.form.get('description')?.clearValidators();
      this.form.get('sub_category')?.setValidators([Validators.required]);
    }

    this.form.get('title')?.updateValueAndValidity();
    this.form.get('description')?.updateValueAndValidity();
    this.form.get('sub_category')?.updateValueAndValidity();
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImages = [];
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.selectedImages.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (this.selectedType == 'NEWS') {
            this.uploadedImages = [e.target.result]
          } else {
            this.uploadedImages.push(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit(form: any) {
    form.markAllAsTouched()
    if (form.invalid) {
      return
    }
    let apiUrl = ''
    let formData = new FormData()
    if (this.paramId) {
      apiUrl = `subcategory/update-subcategory`
      formData.set('id', this.paramId)
      formData.set('subcategory_name', form.value.name)
      formData.set('category_id', form.value.category)
    } else {
      apiUrl = `website-images/add-websiteimage`
      formData.set('website_category_id', form.value.category)
      formData.set('website_subcategory_id', form.value.sub_category)
      formData.set('title', form.value.title)
      formData.set('description', form.value.description)
      this.selectedImages.forEach(file => {
        formData.append('file', file, file.name);
      });
    }

    this.service.upload(apiUrl, formData).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.router.navigate(['/website'])
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
    let apiUrl = `website-images/get-websitecategory`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.category
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getSubCategories(event: any) {

    this.selectedType = event.target.value == 5 ? 'NEWS' : 'INAGE'

    let apiUrl = `website-images/get-websitesubcategory`
    let formData = new URLSearchParams()
    formData.set('category_id', event.target.value)
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.subCategories = res.subcategory
      } else {
        this.toastr.error(res.message)
      }
    })
    this.updateValidators();
  }

  removeImg(index: number): void {
    this.uploadedImages.splice(index, 1);
    this.selectedImages.splice(index, 1);
  }
}
