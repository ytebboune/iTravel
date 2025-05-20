"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
        try {
            await this.transporter.verify();
            console.log('SMTP connection established successfully');
        }
        catch (error) {
            console.error('SMTP connection failed:', error);
        }
    }
    async sendVerificationEmail(email, token) {
        const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
        const info = await this.transporter.sendMail({
            from: `"iTravel" <${this.configService.get('SMTP_USER')}>`,
            to: email,
            subject: 'Vérifiez votre adresse email',
            html: `
        <h1>Bienvenue sur iTravel !</h1>
        <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${verificationUrl}">Vérifier mon email</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
      `,
        });
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    async sendPasswordResetEmail(email, token) {
        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
        const info = await this.transporter.sendMail({
            from: `"iTravel" <${this.configService.get('SMTP_USER')}>`,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour en créer un nouveau :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      `,
        });
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    async sendWelcomeEmail(email, username) {
        const info = await this.transporter.sendMail({
            from: `"iTravel" <${this.configService.get('SMTP_USER')}>`,
            to: email,
            subject: 'Bienvenue sur iTravel !',
            html: `
        <h1>Bienvenue sur iTravel, ${username} !</h1>
        <p>Nous sommes ravis de vous accueillir dans notre communauté de voyageurs.</p>
        <p>Voici quelques suggestions pour commencer :</p>
        <ul>
          <li>Complétez votre profil</li>
          <li>Explorez les destinations populaires</li>
          <li>Créez votre premier projet de voyage</li>
          <li>Connectez-vous avec d'autres voyageurs</li>
        </ul>
        <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
        <p>Bon voyage !</p>
      `,
        });
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    async sendNewLoginAlert(email, deviceInfo) {
        const info = await this.transporter.sendMail({
            from: `"iTravel" <${this.configService.get('SMTP_USER')}>`,
            to: email,
            subject: 'Nouvelle connexion détectée',
            html: `
        <h1>Nouvelle connexion détectée</h1>
        <p>Une nouvelle connexion a été détectée sur votre compte :</p>
        <p>${deviceInfo}</p>
        <p>Si ce n'était pas vous, veuillez changer votre mot de passe immédiatement.</p>
      `,
        });
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map