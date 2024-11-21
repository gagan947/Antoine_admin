import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  logInForm: FormGroup
  showPassword: boolean = false
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }


  onSubmit(form: any) {
    form.markAllAsTouched()
    if (form.invalid) {
      return
    }
    this.loading = true;
    let apiUrl = `user/signin`
    let formData = new URLSearchParams()
    formData.set('email', form.value.email)
    formData.set('password', form.value.password)
    this.service.post(apiUrl, formData.toString()).subscribe({
      next: (res) => {
        if (res.success && res.userData.role == '0' || res.success && res.userData.role == '1') {
          this.loading = false;
          this.toastr.success(res.message)
          this.service.setToken(res.login_token)
          localStorage.setItem('adminData', JSON.stringify(res.userData))
          this.router.navigate(['/dashboard'])
        } else {
          this.toastr.error('Invalid Credential')
          this.loading = false;
        }
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error.message)
      }
    });
  }

  getErrorMessage(field: string) {
    const control = this.logInForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address'
    }
    return ''
  }
}
