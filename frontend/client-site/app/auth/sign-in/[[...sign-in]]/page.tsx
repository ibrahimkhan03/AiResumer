'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">AI Resumer</span>
          </Link>
          <p className="text-muted-foreground mt-2">
            Welcome back! Sign in to your account.
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          <SignIn 
            redirectUrl="/dashboard"
            afterSignInUrl="/dashboard"
            signUpUrl="/auth/sign-up"
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-primary hover:bg-primary/90 text-primary-foreground',
                card: 'shadow-none',
                headerTitle: 'text-foreground',
                headerSubtitle: 'text-muted-foreground',
                socialButtonsBlockButton: 
                  'border hover:bg-accent text-foreground',
                dividerLine: 'bg-border',
                dividerText: 'text-muted-foreground',
                formFieldLabel: 'text-foreground',
                formFieldInput: 
                  'bg-background border text-foreground focus:ring-ring',
                footerActionLink: 'text-primary hover:text-primary/90',
              },
            }}
          />
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            href="/sign-up" 
            className="text-primary hover:text-primary/90 font-medium"
          >
            Sign up here
          </Link>
        </div>
        
        <div className="text-center mt-4">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}