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
exports.FilterAccommodationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@itravel/shared");
class FilterAccommodationDto {
}
exports.FilterAccommodationDto = FilterAccommodationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix minimum', required: false, example: 50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilterAccommodationDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix maximum', required: false, example: 200 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilterAccommodationDto.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type d\'hébergement', enum: shared_1.AccommodationType, required: false, example: shared_1.AccommodationType.HOTEL }),
    (0, class_validator_1.IsEnum)(shared_1.AccommodationType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterAccommodationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Critère de tri (price, votes, score)', required: false, example: 'price' }),
    (0, class_validator_1.IsEnum)(['price', 'votes', 'score']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilterAccommodationDto.prototype, "sortBy", void 0);
//# sourceMappingURL=filter-accommodation.dto.js.map