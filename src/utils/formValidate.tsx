const VALILDATE_ERROR = {
  required: {
    validate_type: 'required',
    // message: 'Please fill out this field',
    message: 'FIELD_IS_REQUIRED',
  },
  min: (min: number) => ({
    validate_type: 'min',
    min,
    // message: `Value must be greater than or equal to ${min}`,
    message: 'FIELD_INVALID_MIN',
  }),
  max: (max: number) => ({
    validate_type: 'max',
    max,
    // message: `Value must be less than or equal to ${max}`,
    message: 'FIELD_INVALID_MAX',
  }),
  minlength: (value: string, minlength: number) => ({
    validate_type: 'minlength',
    minlength,
    currently: value.length,
    // message: `This text must be greater than ${minlength} ${minlength > 1 ? `characters` : `character`} (you are currently using ${value.length} ${value.length > 1 ? `characters` : `character`})`,
    message: 'FIELD_INVALID_MINLENGTH',
  }),
  maxlength: (value: string, maxlength: number) => ({
    validate_type: 'maxlength',
    maxlength,
    currently: value.length,
    // message: `This text must be less than ${maxlength} ${maxlength > 1 ? `characters` : `character`} (you are currently using ${value.length} ${value.length > 1 ? `characters` : `character`})`,
    message: 'FIELD_INVALID_MAXLENGTH',
  }),
  pattern: {
    validate_type: 'pattern',
    // message: 'Please match the requested pattern',
    message: 'FIELD_INVALID_PATTERN',
  },
  type: (type: string) => ({
    validate_type: 'type',
    type,
    // message: `Please match the requested type '${type}'`,
    message: 'FIELD_INVALID_TYPE',
  }),
};

interface FormValidateResponse {
  success: boolean,
  payload?: any,
  error?: any
}

const VALIDATE_RESPONSE = {
  success: (): FormValidateResponse => ({ success: true }),
  error: (error: any): FormValidateResponse => ({ success: false, error }),
};

export const validateEmail = (value: string): boolean => {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return re.test(value);
};

export const validatePhoneNumber = (value: string): boolean => {
  //   const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  //   return re.test(value);
  return Boolean(value);
};

interface Options {
  required?: boolean,
  min?: number,
  max?: number,
  minlength?: number,
  maxlength?: number,
  pattern?: RegExp
}

export const formValidate = (value: any, options: Options, type: string = 'text'): FormValidateResponse => {
  try {
    // check options
    if (options.required && !value) {
      return VALIDATE_RESPONSE.error(VALILDATE_ERROR.required);
    }
    if (options.min && (typeof value !== 'number' || value < options.min)) {
      return VALIDATE_RESPONSE.error(VALILDATE_ERROR.min(options.min));
    }
    if (options.max && (typeof value !== 'number' || value > options.max)) {
      return VALIDATE_RESPONSE.error(VALILDATE_ERROR.max(options.max));
    }
    if (options.minlength && (typeof value !== 'string' || value.length < options.minlength)) {
      return VALIDATE_RESPONSE.error(VALILDATE_ERROR.minlength(value, options.minlength));
    }
    if (options.maxlength && (typeof value !== 'string' || value.length > options.maxlength)) {
      return VALIDATE_RESPONSE.error(VALILDATE_ERROR.maxlength(value, options.maxlength));
    }
    if (options.pattern && options.pattern instanceof RegExp && !options.pattern.test(value)) {
      return VALIDATE_RESPONSE.error(VALILDATE_ERROR.pattern);
    }

    // type
    switch (type) {
      case 'text':
        break;

      case 'number':
        if (!Number(value)) {
          return VALIDATE_RESPONSE.error(VALILDATE_ERROR.type(type));
        }
        break;

      case 'email':
        if (!validateEmail(value)) {
          return VALIDATE_RESPONSE.error(VALILDATE_ERROR.type(type));
        }
        break;

      case 'tel':
        if (!validatePhoneNumber(value)) {
          return VALIDATE_RESPONSE.error(VALILDATE_ERROR.type(type));
        }
        break;

      default:
        break;
    }

    return VALIDATE_RESPONSE.success();
  } catch (error) {
    return VALIDATE_RESPONSE.error({ message: error.message });
  }
};