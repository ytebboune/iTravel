import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  let dto: RegisterDto;

  beforeEach(() => {
    dto = new RegisterDto();
  });

  it('should be valid with correct data', async () => {
    dto.email = 'test@example.com';
    dto.username = 'testuser';
    dto.password = 'Password123!';
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    dto.email = 'invalid-email';
    dto.username = 'testuser';
    dto.password = 'Password123!';
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail with invalid username', async () => {
    dto.email = 'test@example.com';
    dto.username = 'test user'; // contains space
    dto.password = 'Password123!';
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should fail with weak password', async () => {
    dto.email = 'test@example.com';
    dto.username = 'testuser';
    dto.password = 'weak';
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });

  it('should fail with missing required fields', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with username too short', async () => {
    dto.email = 'test@example.com';
    dto.username = 'te'; // too short
    dto.password = 'Password123!';
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail with password missing special character', async () => {
    dto.email = 'test@example.com';
    dto.username = 'testuser';
    dto.password = 'Password123'; // missing special character
    dto.ipAddress = '192.168.1.1';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('matches');
  });
}); 