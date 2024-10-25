import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input-gg';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { strongPasswordValidator } from '../../../validators';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  SearchCountryField = SearchCountryField
  CountryISO = CountryISO
  preferredCountries: CountryISO[] = [CountryISO.India]
  form: FormGroup
  showPassword: boolean = false
  showConfPassword: boolean = false
  paramId: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private shared: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator]],
      CA: [false],
      HA: [false],
      DA: [false],
      CL: [false],
      HIP: [false]
    });

    this.route.queryParams.subscribe((params) => {
      this.paramId = params['id']
    });
  }

  ngOnInit() {
    if (this.paramId) {
      this.getById()
    }
  }

  onSubmit(form: any) {
    form.markAllAsTouched()
    if (form.invalid) {
      return
    }

    let apiUrl = ``
    const permissions: any = [
      { CA: form.value.CA },
      { HA: form.value.HA },
      { DA: form.value.DA },
      { CL: form.value.CL },
      { HIP: form.value.HIP }
    ];

    let formData = new URLSearchParams()
    formData.set('name', form.value.name)
    formData.set('email', form.value.email)
    formData.set('password', form.value.password)
    formData.set('phone', form.value.phone.number)
    formData.set('role', form.value.role)
    formData.set('permission', JSON.stringify(permissions))

    if (this.paramId) {
      apiUrl = `user/update`
      formData.set('id', this.paramId)

      this.shared.post(apiUrl, formData.toString()).subscribe(res => {
        if (res.success) {
          this.toastr.success(res.message)
          this.router.navigate(['/users'])
        } else {
          this.toastr.error(res.message)
        }
      })
    } else {
      apiUrl = `user/singup`

      this.service.post(apiUrl, formData.toString()).subscribe(res => {
        if (res.success) {
          this.toastr.success(res.message)
          this.router.navigate(['/users'])
        } else {
          this.toastr.error(res.message)
        }
      })
    }
  }

  getErrorMessage(field: string) {
    const control = this.form.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address'
    } else if (control.hasError('minlength')) {
      return `Password must be at least ${control.getError('minlength').requiredLength
        } characters long`
    } else if (control.hasError('validatePhoneNumber')) {
      const errors = control.getError('validatePhoneNumber')
      if (!errors.valid) return 'Please enter a valid phone number'
    } else if (control.hasError('strongPassword')) {
      const errors = control.getError('strongPassword')
      if (!errors.isValidLength)
        return 'Password must be at least 8 characters long'
      if (!errors.hasUpperCase)
        return 'Password must contain at least one uppercase letter'
      if (!errors.hasLowerCase)
        return 'Password must contain at least one lowercase letter'
      if (!errors.hasNumeric) return 'Password must contain at least one number'
      if (!errors.hasSpecialCharacter)
        return 'Password must contain at least one special character'
    }
    return ''
  }

  getById() {
    let apiurl = `user/getuser-id?id=${this.paramId}`
    this.shared.get(apiurl).subscribe(res => {
      if (res.success) {
        const data = res.userData

        let permissions = [];
        try {
          let cleanedPermission = data.permission.replace(/'/g, '"').replace(/([{,])(\w+):/g, '$1"$2":');
          permissions = JSON.parse(cleanedPermission);
        } catch (error) {
          console.error('Permission parsing error:', error);
        }

        const permissionObject = permissions.reduce((acc: any, permission: any) => {
          return { ...acc, ...permission };
        }, {})

        this.form.patchValue(
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: data.role,
            CA: permissionObject.CA || false,
            HA: permissionObject.HA || false,
            DA: permissionObject.DA || false,
            CL: permissionObject.CL || false,
            HIP: permissionObject.HIP || false
          }
        )
      } else {
        this.toastr.error(res.message)
      }
    })
  }
}
