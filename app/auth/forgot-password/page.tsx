"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-3">Check your email</h2>
        <p className="text-gray-500 mb-2 max-w-sm">
          We sent a password reset link to
        </p>
        <p className="font-semibold text-navy mb-8">{email}</p>
        <p className="text-sm text-gray-400 mb-8">
          If you don&apos;t see it, check your spam folder.
        </p>
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm text-navy font-medium hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy mb-2">Reset your password</h2>
        <p className="text-gray-500 text-sm">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full"
          loading={loading}
        >
          Send reset link
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
