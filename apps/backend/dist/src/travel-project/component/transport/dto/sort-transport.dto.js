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
exports.SortOrder = exports.SortField = exports.SortTransportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const shared_1 = require("@itravel/shared");
Object.defineProperty(exports, "SortField", { enumerable: true, get: function () { return shared_1.SortField; } });
Object.defineProperty(exports, "SortOrder", { enumerable: true, get: function () { return shared_1.SortOrder; } });
class SortTransportDto {
    constructor() {
        this.order = shared_1.SortOrder.DESC;
    }
}
exports.SortTransportDto = SortTransportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.SortField, required: false, description: 'Field to sort by' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.SortField),
    __metadata("design:type", String)
], SortTransportDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: shared_1.SortOrder, required: false, description: 'Sort order (ASC or DESC)', default: shared_1.SortOrder.DESC }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shared_1.SortOrder),
    __metadata("design:type", String)
], SortTransportDto.prototype, "order", void 0);
//# sourceMappingURL=sort-transport.dto.js.map