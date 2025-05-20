import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsEndDateAfterStartDate implements ValidatorConstraintInterface {
    validate(endDate: string, args: ValidationArguments): boolean;
    defaultMessage(): string;
}
