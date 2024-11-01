import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function strongPasswordValidator(
      control: AbstractControl
): ValidationErrors | null {
      const value = control.value || ''

      const hasUpperCase = /[A-Z]/.test(value)
      const hasLowerCase = /[a-z]/.test(value)
      const hasNumeric = /[0-9]/.test(value)
      const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value)
      const isValidLength = value.length >= 8

      const passwordValid =
            hasUpperCase &&
            hasLowerCase &&
            hasNumeric &&
            hasSpecialCharacter &&
            isValidLength

      // Return errors object or null
      if (!passwordValid) {
            return {
                  strongPassword: {
                        hasUpperCase: hasUpperCase,
                        hasLowerCase: hasLowerCase,
                        hasNumeric: hasNumeric,
                        hasSpecialCharacter: hasSpecialCharacter,
                        isValidLength: isValidLength
                  }
            }
      }
      return null
}

export function passwordMatchValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
            const password = control.get('password');
            const confirmPassword = control.get('confirm_password');

            if (!password || !confirmPassword) {
                  return null;
            }

            return password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
      };
}


export function dateRangeValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
            const startDate = control.get('start_date')?.value;
            const endDate = control.get('end_date')?.value;

            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                  return { dateRangeInvalid: true };
            } else {
                  return { dateRangeInvalid: false };
            }
            return null;
      };
}

export class whiteSpaceValidator {
      static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
            if ((control.value as string).indexOf(' ') >= 0) {
                  return { cannotContainSpace: true }
            }
            return null;
      }
}

export class NoWhitespaceDirective {
      static validate(control: AbstractControl): ValidationErrors | null {
            if (!control.value || control.value.trim() == '') {
                  return { required: true };
            }
            return null;
      }
}