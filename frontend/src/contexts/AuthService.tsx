export interface User {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

const API_URL = 'http://localhost:5215/api';

class AuthService {
  // Login user and store token
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}/Users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(typeof errorData === 'string' ? errorData : 'Login failed');
    }

    const data: LoginResponse = await response.json();

    // Store token and user in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data.user;
  }

  // Logout user and clear storage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      this.logout();
      return null;
    }
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Get auth header
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Get user profile from API
  async getProfile(): Promise<User> {
    const response = await fetch(`${API_URL}/Users/profile`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, log out user
      if (response.status === 401) {
        this.logout();
      }
      throw new Error('Failed to get profile');
    }

    return await response.json();
  }
}

export default new AuthService();
