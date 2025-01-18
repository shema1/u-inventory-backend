import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureADStrategy extends PassportStrategy(Strategy, 'AzureAD') {
  constructor(protected readonly configService: ConfigService) {
    console.log(
      "configService.get('AZURE_AD_AUDIENCE')",
      configService.get('AZURE_AD_AUDIENCE'),
    );
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: `api://${configService.get('AZURE_AD_AUDIENCE')}`,
      issuer: `https://sts.windows.net/${configService.get('AZURE_AD_TENANTID')}/`,
      algorithms: ['RS256'],
      ignoreExpiration: true,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 50,
        jwksUri: `https://login.microsoftonline.com/${configService.get('AZURE_AD_TENANTID')}/discovery/v2.0/keys`,
      }),
    });
  }

  validate(payload: any) {
    console.log('payload', payload);

    return payload;
  }
}
