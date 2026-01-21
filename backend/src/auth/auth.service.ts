import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // This is a mock implementation - in real app, check against database
    if (username === 'admin' && password === 'admin123') {
      return { id: 1, username: 'admin', role: 'admin' };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, role: user.role },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return { id: payload.sub, username: payload.username, role: payload.role };
    } catch (error) {
      return null;
    }
  }
}