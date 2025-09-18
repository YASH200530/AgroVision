// Mock API service for demonstration
// In production, replace with actual backend API calls

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredLanguage: 'en' | 'hi';
  isVerified: boolean;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  language: 'en' | 'hi';
}

interface LoginData {
  phone: string;
  password: string;
}

interface OTPVerificationData {
  phone: string;
  otp: string;
}

// Mock database storage
const USERS_KEY = 'agrovision_users';
const OTP_KEY = 'agrovision_otps';

class APIService {
  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private getOTPs(): Record<string, { otp: string; expires: number }> {
    return JSON.parse(localStorage.getItem(OTP_KEY) || '{}');
  }

  private saveOTPs(otps: Record<string, { otp: string; expires: number }>): void {
    localStorage.setItem(OTP_KEY, JSON.stringify(otps));
  }

  async signup(data: SignupData): Promise<{ success: boolean; message: string; userId?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === data.email || u.phone === data.phone)) {
      return { success: false, message: 'User with this email or phone already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      preferredLanguage: data.language,
      isVerified: false
    };

    users.push(newUser);
    this.saveUsers(users);

    // Send OTP
    await this.sendOTP(data.phone);

    return { success: true, message: 'User created successfully. OTP sent to phone.', userId: newUser.id };
  }

  async login(data: LoginData): Promise<{ success: boolean; message: string; user?: User; needsVerification?: boolean }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = this.getUsers();
    const user = users.find(u => u.phone === data.phone);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // In a real app, you'd verify the password hash
    // For demo purposes, we'll assume password is correct if user exists

    if (!user.isVerified) {
      await this.sendOTP(data.phone);
      return { 
        success: false, 
        message: 'Phone number not verified. OTP sent to your phone.', 
        needsVerification: true 
      };
    }

    return { success: true, message: 'Login successful', user };
  }

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    const otps = this.getOTPs();
    otps[phone] = { otp, expires };
    this.saveOTPs(otps);

    // In a real app, you'd send SMS via Twilio, AWS SNS, etc.
    console.log(`OTP for ${phone}: ${otp}`);
    
    return { success: true, message: `OTP sent to ${phone}. Check console for demo OTP.` };
  }

  async verifyOTP(data: OTPVerificationData): Promise<{ success: boolean; message: string; user?: User }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const otps = this.getOTPs();
    const otpData = otps[data.phone];

    if (!otpData) {
      return { success: false, message: 'No OTP found for this phone number' };
    }

    if (Date.now() > otpData.expires) {
      delete otps[data.phone];
      this.saveOTPs(otps);
      return { success: false, message: 'OTP has expired' };
    }

    if (otpData.otp !== data.otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // OTP is valid, mark user as verified
    const users = this.getUsers();
    const user = users.find(u => u.phone === data.phone);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    user.isVerified = true;
    this.saveUsers(users);

    // Clean up OTP
    delete otps[data.phone];
    this.saveOTPs(otps);

    return { success: true, message: 'Phone number verified successfully', user };
  }

  async resendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    return this.sendOTP(phone);
  }
}

export const apiService = new APIService();