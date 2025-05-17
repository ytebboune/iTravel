import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  let dto: LoginDto;

  beforeEach(() => {
    dto = new LoginDto();
  });

  it('should be valid with correct data', async () => {
    dto.email = 'test@example.com';
    dto.password = 'Password123!';
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    dto.email = 'invalid-email';
    dto.password = 'Password123!';
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail with missing required fields', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with empty password', async () => {
    dto.email = 'test@example.com';
    dto.password = '';
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail with invalid IP address format', async () => {
    dto.email = 'test@example.com';
    dto.password = 'Password123!';
    dto.ipAddress = 'invalid-ip';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });
}); 