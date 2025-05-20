"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlValidator = void 0;
const common_1 = require("@nestjs/common");
let UrlValidator = class UrlValidator {
    constructor() {
        this.allowedDomains = {
            transport: ['skyscanner', 'trainline', 'ouigo', 'sncf-connect'],
            accommodation: ['airbnb', 'booking', 'hotels'],
        };
    }
    validateUrl(url, type) {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname.toLowerCase();
            return this.allowedDomains[type].some(allowedDomain => domain.includes(allowedDomain));
        }
        catch {
            return false;
        }
    }
    getDomainType(url) {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname.toLowerCase();
            if (this.allowedDomains.transport.some(d => domain.includes(d))) {
                return 'transport';
            }
            if (this.allowedDomains.accommodation.some(d => domain.includes(d))) {
                return 'accommodation';
            }
            return null;
        }
        catch {
            return null;
        }
    }
};
exports.UrlValidator = UrlValidator;
exports.UrlValidator = UrlValidator = __decorate([
    (0, common_1.Injectable)()
], UrlValidator);
//# sourceMappingURL=url-validator.js.map