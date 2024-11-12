import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  form: FormGroup
  loading: boolean = false

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
    })
  }


  onSubmit(form: any) {

    form.markAllAsTouched()
    if (form.invalid) {
      return
    }

    this.loading = true;
    let apiUrl = `user/forget-password`
    let formData = new URLSearchParams()
    formData.set('email', form.value.email)

    this.service.post(apiUrl, formData.toString()).subscribe({
      next: (res) => {
        if (res.success) {
          this.loading = false;
          this.toastr.success(res.message)
          this.form.reset()
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error.message)
      }
    });
  }

  getErrorMessage(field: string) {
    const control = this.form.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address'
    }
    return ''
  }

}
