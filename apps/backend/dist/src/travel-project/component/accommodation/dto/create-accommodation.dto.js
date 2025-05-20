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
exports.CreateAccommodationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@itravel/shared");
class CreateAccommodationDto {
}
exports.CreateAccommodationDto = CreateAccommodationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom de l\'hébergement', example: 'Hôtel du Lac' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAccommodationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description de l\'hébergement', example: 'Un bel hôtel au bord du lac' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAccommodationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lien vers le site de l\'hébergement', example: 'https://example.com/hotel' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAccommodationDto.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix par nuit', example: 150 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAccommodationDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL de l\'image principale', example: 'https://example.com/hotel.jpg' }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAccommodationDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Adresse de l\'hébergement', example: '123 rue du Lac, 75000 Paris' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAccommodationDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type d\'hébergement', enum: shared_1.AccommodationType, example: shared_1.AccommodationType.HOTEL }),
    (0, class_validator_1.IsEnum)(shared_1.AccommodationType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAccommodationDto.prototype, "type", void 0);
//# sourceMappingURL=create-accommodation.dto.js.map