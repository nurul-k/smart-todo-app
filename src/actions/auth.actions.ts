'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function registerUser(name: string, email: string, password: string) {
  try {
    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'USER',
      isActive: true,
    });

    return {
      success: true,
      message: 'User registered successfully. Please log in.',
      userId: user._id.toString(),
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
