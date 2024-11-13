import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input-gg';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NoWhitespaceDirective, strongPasswordValidator } from '../../../validators';
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
  selectedUser: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private shared: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, NoWhitespaceDirective.validate]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator]],
      CA: [false],
      HA: [false],
      CT: [false],
      UI: [false],
      AR: [false],
      AC: [false],
      DNI: [false],
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
      { CT: form.value.CT },
      { UI: form.value.UI },
      { AR: form.value.AR },
      { AC: form.value.AC },
      { DNI: form.value.DNI },
      { HIP: form.value.HIP }
    ];


    let formData = new URLSearchParams()
    formData.set('name', form.value.name)
    formData.set('email', form.value.email)
    formData.set('phone', form.value.phone.e164Number)
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
      formData.set('password', form.value.password)
      formData.set('verify_status', '1')
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

        this.selectedUser = data.role
        this.form.patchValue(
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: data.role,
            CA: permissionObject.CA || false,
            HA: permissionObject.HA || false,
            CT: permissionObject.CT || false,
            UI: permissionObject.UI || false,
            AR: permissionObject.AR || false,
            AC: permissionObject.AC || false,
            DNI: permissionObject.DNI || false,
            HIP: permissionObject.HIP || false
          })
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  userRoleChange(event: any) {
    this.selectedUser = event.target.value
  }
}
