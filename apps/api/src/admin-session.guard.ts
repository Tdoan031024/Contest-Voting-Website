import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppService } from './app.service';
import * as crypto from 'crypto';

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appService: AppService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const cookies = request.headers.cookie;
      if (!cookies) {
        throw new UnauthorizedException('Không tìm thấy cookie phiên đăng nhập.');
      }

      const adminSessionCookie = cookies.split(';').find((c: string) => c.trim().startsWith('admin_session='));
      if (!adminSessionCookie) {
        throw new UnauthorizedException('Yêu cầu phiên đăng nhập quản trị.');
      }

      const token = adminSessionCookie.split('=')[1];
      if (!token) {
        throw new UnauthorizedException('Phiên đăng nhập rỗng.');
      }

      const parts = token.split('.');
      if (parts.length < 3) {
        throw new UnauthorizedException('Định dạng phiên đăng nhập không hợp lệ.');
      }

      const signature = parts.pop();
      const expiresAtStr = parts.pop();
      const username = parts.join('.');
      if (!username || !expiresAtStr || !signature) {
        throw new UnauthorizedException('Dinh dang phien dang nhap khong hop le.');
      }
      const expiresAt = Number(expiresAtStr);
      if (isNaN(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn.');
      }

      const secret = this.appService.getAdminSessionSecret();
      const payload = `${username}.${expiresAtStr}`;
      const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');

      if (expectedSig !== signature) {
        throw new UnauthorizedException('Chữ ký phiên đăng nhập không hợp lệ.');
      }

      const adminUser = await this.prisma.adminUser.findUnique({
        where: { username },
      });

      if (!adminUser || !adminUser.isActive) {
        throw new UnauthorizedException('Tài khoản quản trị không tồn tại hoặc đã bị khóa.');
      }

      // Gắn thông tin admin vào request để sử dụng ở controller nếu cần
      request.admin = {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role,
      };

      return true;
    } catch (err: any) {
      if (err instanceof HttpException) {
        throw err;
      }
      console.error('CRITICAL ERROR in AdminSessionGuard:', err);
      throw new InternalServerErrorException(
        `Lỗi hệ thống trong AdminSessionGuard: ${err.message || err}. Stack: ${err.stack || ''}`
      );
    }
  }
}
