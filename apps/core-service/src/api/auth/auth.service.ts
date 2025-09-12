import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { AuthRepository } from './auth.repository.js';

// The service layer contains the core business logic.
// It is completely decoupled from the database via the repository.
export class AuthService {
  private authRepository: AuthRepository;

  // The repository is "injected" via the constructor.
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async registerUser(userData: any): Promise<User> {
    const { fullName, email, password, role } = userData;

    if (!fullName || !email || !password || !role) {
      throw new Error('Missing required fields');
    }

    // Business Logic: Hashing the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Call the repository to save the data
    return this.authRepository.createUser({
      fullName,
      email,
      password: hashedPassword,
      role,
    });
  }

  async loginUser(email: string, pass: string): Promise<{ accessToken: string }> {
    if (!email || !pass) {
      throw new Error('Email and password are required.');
    }

    // Call the repository to find the user
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials.');
    }

    // Business Logic: Comparing passwords
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    // Business Logic: Generating a token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables.');
      throw new Error('Server configuration error.');
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
      expiresIn: '1d',
    });

    return { accessToken };
  }
}

