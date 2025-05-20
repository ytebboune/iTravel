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
exports.UpdatePrivacyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePrivacyDto {
}
exports.UpdatePrivacyDto = UpdatePrivacyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Profil privé',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacyDto.prototype, "isPrivate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Afficher l\'email',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacyDto.prototype, "showEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Afficher les lieux visités',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacyDto.prototype, "showVisitedPlaces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Afficher les posts',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacyDto.prototype, "showPosts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Afficher les stories',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePrivacyDto.prototype, "showStories", void 0);
//# sourceMappingURL=update-privacy.dto.js.map