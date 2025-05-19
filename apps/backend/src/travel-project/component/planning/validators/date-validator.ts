import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isEndDateAfterStartDate', async: false })
export class IsEndDateAfterStartDate implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments) {
    const startDate = args.object[args.constraints[0]];
    return new Date(endDate) > new Date(startDate);
  }

  defaultMessage() {
    return 'La date de fin doit être après la date de début';
  }
} 