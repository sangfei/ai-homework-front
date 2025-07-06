import { storage } from '../utils/storage';
import { authenticatedFetch } from '../utils/request';

// Token刷新响应接口
export interface RefreshTokenResponse {
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresTime: number;
  };
  msg: string;
}

// Token刷新管理器
export class TokenRefreshManager {
  private static instance: TokenRefreshManager;
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshInterval = 600000; // 10分钟（600000毫秒）
  private maxRetries = 3;
  private retryDelay = 5000; // 5秒

  static getInstance(): TokenRefreshManager {
    if (!TokenRefreshManager.instance) {
      TokenRefreshManager.instance = new TokenRefreshManager();
    }
    return TokenRefreshManager.instance;
  }

  /**
   * 启动自动刷新Token定时任务
   */
  startAutoRefresh(): void {
    this.stopAutoRefresh(); // 先停止现有的定时器
    
    console.log('🔄 启动自动刷新Token定时任务，间隔:', this.refreshInterval / 1000, '秒');
    
    this.refreshTimer = setInterval(async () => {
      await this.performTokenRefresh();
    }, this.refreshInterval);

    // 立即执行一次检查
    setTimeout(() => {
      this.performTokenRefresh();
    }, 1000);
  }

  /**
   * 停止自动刷新
   */
  stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      console.log('⏹️ 停止自动刷新Token定时任务');
    }
  }

  /**
   * 执行Token刷新
   */
  private async performTokenRefresh(retryCount = 0): Promise<boolean> {
    if (this.isRefreshing) {
      console.log('🔄 Token刷新正在进行中，跳过本次刷新');
      return false;
    }

    const refreshToken = storage.getAuthData('refreshToken');
    const accessToken = storage.getAuthData('accessToken');
    const tenantId = storage.getAuthData('tenantId');

    if (!refreshToken || !accessToken || !tenantId) {
      console.warn('⚠️ 缺少必要的认证信息，停止自动刷新');
      this.stopAutoRefresh();
      return false;
    }

    this.isRefreshing = true;

    try {
      console.log('🔄 开始刷新Token...');
      
      const response = await fetch(
        'http://localhost:48080/admin-api/system/auth/refresh-token',
        {
          method: 'POST',
          headers: {
            'tenant-id': tenantId,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify({
            refreshToken: refreshToken
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      const result: RefreshTokenResponse = await response.json();

      if (result.code !== 0) {
        throw new Error(result.msg || 'Token刷新失败');
      }

      if (!result.data || !result.data.accessToken || !result.data.refreshToken) {
        throw new Error('Token刷新响应数据异常');
      }

      // 更新Token
      this.updateTokens(result.data.accessToken, result.data.refreshToken);
      
      console.log('✅ Token刷新成功');
      return true;

    } catch (error) {
      console.error('❌ Token刷新失败:', error);
      
      // 重试机制
      if (retryCount < this.maxRetries) {
        console.log(`🔄 ${this.retryDelay / 1000}秒后进行第${retryCount + 1}次重试...`);
        setTimeout(() => {
          this.performTokenRefresh(retryCount + 1);
        }, this.retryDelay);
        return false;
      } else {
        console.error('❌ Token刷新重试次数已达上限，停止自动刷新');
        this.handleRefreshFailure();
        return false;
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * 更新Token到全局变量和存储
   */
  private updateTokens(accessToken: string, refreshToken: string): void {
    // 更新全局变量
    (window as any).globalAccessToken = accessToken;
    (window as any).globalRefreshToken = refreshToken;

    // 更新存储
    storage.setAuthData('accessToken', accessToken);
    storage.setAuthData('refreshToken', refreshToken);

    console.log('🔄 Token已更新到全局变量和存储');
  }

  /**
   * 处理刷新失败
   */
  private handleRefreshFailure(): void {
    this.stopAutoRefresh();
    
    // 清除认证数据
    storage.clearAllAuthData();
    
    // 通知用户重新登录
    console.warn('⚠️ Token刷新失败，需要重新登录');
    
    // 可以触发全局事件或回调
    window.dispatchEvent(new CustomEvent('tokenRefreshFailed'));
    
    // 跳转到登录页
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  /**
   * 手动刷新Token
   */
  async manualRefresh(): Promise<boolean> {
    return await this.performTokenRefresh();
  }

  /**
   * 检查是否需要刷新Token
   */
  shouldRefreshToken(): boolean {
    const accessToken = storage.getAuthData('accessToken');
    const refreshToken = storage.getAuthData('refreshToken');
    return !!(accessToken && refreshToken);
  }
}

export const tokenRefreshManager = TokenRefreshManager.getInstance();