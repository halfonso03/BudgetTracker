using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Validators
{

    public class ValueMustBeTrueValidator() : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null) return ValidationResult.Success;

            if (value is bool boolValue && boolValue == true)
            {
                return ValidationResult.Success;
            }

            if (!String.IsNullOrEmpty(ErrorMessage)) return new ValidationResult(ErrorMessage);

            return new ValidationResult($"The field {validationContext.DisplayName} must be be True.");
        }
    }
}