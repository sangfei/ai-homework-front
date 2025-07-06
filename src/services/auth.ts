// 认证服务
export interface TenantResponse {
  code: number;
  data: string;
  msg: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  code: number;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expiresTime: number;
  };
  msg: string;
}

// 全局变量存储访问令牌
let globalAccessToken: string | null = null;
let globalTenantId: string | null = null;

export const getAccessToken = (): string | null => globalAccessToken;
export const getTenantId = (): string | null => globalTenantId;

export const setAccessToken = (token: string): void => {
  globalAccessToken = token;
  // 同时保存到localStorage
  localStorage.setItem('accessToken', token);
};

export const setTenantId = (tenantId: string): void => {
  globalTenantId = tenantId;
  // 同时保存到localStorage
  localStorage.setItem('tenantId', tenantId);
};

export const clearAccessToken = (): void => {
  globalAccessToken = null;
  globalTenantId = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tenantId');
};

// 初始化时从localStorage恢复token
export const initializeAuth = (): void => {
  const savedToken = localStorage.getItem('accessToken');
  const savedTenantId = localStorage.getItem('tenantId');
  if (savedToken) {
    globalAccessToken = savedToken;
  }
  if (savedTenantId) {
    globalTenantId = savedTenantId;
  }
};

/**
 * 第一步：根据手机号获取租户ID
 */
export const getTenantIdByMobile = async (mobile: string): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:48080/admin-api/system/tenant/get-id-by-mobile?mobile=${encodeURIComponent(mobile)}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Accept': '*/*'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }

    const result: TenantResponse = await response.json();
    
    if (result.code !== 0) {
      throw new Error(result.msg || '获取租户ID失败');
    }

    if (!result.data) {
      throw new Error('未找到对应的租户信息');
    }

    return result.data;
  } catch (error) {
    console.error('获取租户ID失败:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络请求失败，请检查网络连接');
  }
};

/**
 * 第二步：执行登录
 */
export const performLogin = async (
  username: string, 
  password: string, 
  tenantId: string
): Promise<LoginResponse['data']> => {
  try {
    const loginData: LoginRequest = {
      username,
      password,
      rememberMe: true
    };

    const response = await fetch(
      'http://localhost:48080/admin-api/system/auth/login',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'tenant-id': tenantId,
          'Accept': '*/*'
        },
        body: JSON.stringify(loginData)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }

    const result: LoginResponse = await response.json();
    
    if (result.code !== 0) {
      throw new Error(result.msg || '登录失败');
    }

    if (!result.data || !result.data.accessToken) {
      throw new Error('登录响应数据异常');
    }

    // 保存访问令牌到全局变量
    setAccessToken(result.data.accessToken);

    return result.data;
  } catch (error) {
    console.error('登录失败:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络请求失败，请检查网络连接');
  }
};

/**
 * 完整的登录流程
 */
export const loginWithMobile = async (
  mobile: string, 
  password: string
): Promise<LoginResponse['data']> => {
  try {
    // 第一步：获取租户ID
    const tenantId = await getTenantIdByMobile(mobile);
    
    // 保存租户ID
    setTenantId(tenantId);
    
    // 第二步：执行登录
    const loginResult = await performLogin(mobile, password, tenantId);
    
    return loginResult;
  } catch (error) {
    console.error('完整登录流程失败:', error);
    throw error;
  }
};