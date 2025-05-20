import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Configuration du transporteur SMTP
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });

    // Vérifier la connexion
    try {
      await this.transporter.verify();
      console.log('SMTP connection established successfully');
    } catch (error) {
      console.error('SMTP connection failed:', error);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/verify-email?token=${token}`;

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

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/reset-password?token=${token}`;

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

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
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

  async sendNewLoginAlert(email: string, deviceInfo: string): Promise<void> {
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
} 