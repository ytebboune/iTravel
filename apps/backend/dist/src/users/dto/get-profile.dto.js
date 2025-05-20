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
exports.GetProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetProfileDto {
}
exports.GetProfileDto = GetProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProfileDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetProfileDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDto.prototype, "isPrivate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDto.prototype, "showEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDto.prototype, "showVisitedPlaces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDto.prototype, "showPosts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDto.prototype, "showStories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetProfileDto.prototype, "followersCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetProfileDto.prototype, "followingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object], required: false }),
    __metadata("design:type", Array)
], GetProfileDto.prototype, "visitedPlaces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object], required: false }),
    __metadata("design:type", Array)
], GetProfileDto.prototype, "posts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object], required: false }),
    __metadata("design:type", Array)
], GetProfileDto.prototype, "stories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDto.prototype, "isFollowing", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], GetProfileDto.prototype, "hasRequestedFollow", void 0);
//# sourceMappingURL=get-profile.dto.js.map