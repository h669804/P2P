import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/pages/RegisterPage.css';
import { User } from '../interfaces/IUser';
import { Errors } from '../interfaces/IErrors';
import authService from '../contexts/AuthService';

// ─────────────────────────────────────────────
// File: RegisterPage.tsx
// Page: RegisterPage
// Description: Side som viser registreringsskjema for å opprette ny brukerkonto.
// Context: Tilgjengelig fra LandingPage og LoginPage. Krever ikke innlogging.
// ─────────────────────────────────────────────

export default function RegisterPage(): JSX.Element {
  const navigate = useNavigate();
  const [User, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    emailConfirm: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setUser({
      ...User,
      [name]: value,
    });

    // Clear the error for this field when user starts typing again
    if (errors[name as keyof Errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    // Validate first name
    if (!User.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Validate last name
    if (!User.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate email
    if (!User.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (User.email.length > 254) {
      newErrors.email = 'Email is too long';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(User.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Validate email confirmation
    if (User.email !== User.emailConfirm) {
      newErrors.emailConfirm = 'Emails do not match';
    }

    // Validate password
    if (!User.password) {
      newErrors.password = 'Password is required';
    } else if (User.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Validate password confirmation
    if (User.password !== User.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const registerResponse = await fetch('http://localhost:5215/api/Users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: User.firstName,
          lastName: User.lastName,
          email: User.email,
          password: User.password,
          createdAt: new Date().toISOString(),
        }),
      });

      if (registerResponse.ok) {
        // ✅ Logg inn brukeren automatisk etter registrering
        await authService.login(User.email, User.password);
        navigate('/profile'); // Eller evt. til /departure el.l.
      } else {
        const errorData = await registerResponse.json();
        setErrors({
          server:
            typeof errorData === 'string' ? errorData : 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ server: 'Connection error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <div className="form-container">
          <h1>Create an Account</h1>
          {errors.server && <div className="error-message">{errors.server}</div>}
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={User.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p>{errors.firstName}</p>}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={User.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p>{errors.lastName}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={User.email}
                onChange={handleChange}
              />
              {errors.email && <p>{errors.email}</p>}
            </div>

            <div>
              <input
                type="email"
                name="emailConfirm"
                placeholder="Repeat email"
                value={User.emailConfirm}
                onChange={handleChange}
              />
              {errors.emailConfirm && <p>{errors.emailConfirm}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={User.password}
                onChange={handleChange}
              />
              {errors.password && <p>{errors.password}</p>}
            </div>

            <div>
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Repeat password"
                value={User.passwordConfirm}
                onChange={handleChange}
              />
              {errors.passwordConfirm && <p>{errors.passwordConfirm}</p>}
            </div>

            <button type="submit" className="register-form-button" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
