import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NoWhitespaceDirective } from '../../../validators';

@Component({
  selector: 'app-sub-tag-form',
  templateUrl: './sub-tag-form.component.html',
  styleUrl: './sub-tag-form.component.css'
})
export class SubTagFormComponent {
  form: FormGroup
  paramId: any
  data: any;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, NoWhitespaceDirective.validate]],
      tag: ['', [Validators.required]],
    })

    this.route.queryParams.subscribe((params) => {
      this.paramId = params['id']
    });
  }

  ngOnInit() {
    this.getTags()
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
      apiUrl = `tag/update`
      formData.set('tag_id', form.value.tag)
      formData.set('subTagName', form.value.name)
      formData.set('id', this.paramId)
    } else {
      apiUrl = `tag/create_subTag`
      formData.set('tag_id', form.value.tag)
      formData.set('subTagName', form.value.name)
    }

    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.router.navigate(['/sub-tags'])
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
    let apiurl = `tag/get-id?id=${this.paramId}`
    this.service.get(apiurl).subscribe(res => {
      if (res.success) {
        const data = res.tagData
        this.form.patchValue(
          {
            name: data.tag
          }
        )
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getTags() {
    this.loading = true
    let apiUrl = `tag/get-all`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.data = res.tagAll
        this.loading = false
      } else {
        //this.toastr.error(res.message)
        this.loading = false
      }
    })
  }
}
