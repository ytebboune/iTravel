"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddActivityToPlanningDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const date_validator_1 = require("../validators/date-validator");
class AddActivityToPlanningDto {
}
exports.AddActivityToPlanningDto = AddActivityToPlanningDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de l\'activité', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddActivityToPlanningDto.prototype, "activityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date de l\'activité', example: '2024-03-20' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AddActivityToPlanningDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heure de début', example: '2024-03-20T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AddActivityToPlanningDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heure de fin', example: '2024-03-20T12:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.Validate)(date_validator_1.IsEndDateAfterStartDate, ['startTime']),
    __metadata("design:type", String)
], AddActivityToPlanningDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notes sur l\'activité', example: 'N\'oubliez pas d\'apporter votre appareil photo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddActivityToPlanningDto.prototype, "notes", void 0);
//# sourceMappingURL=add-activity-to-planning.dto.js.map