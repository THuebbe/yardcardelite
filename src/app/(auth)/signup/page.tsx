import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <SignupForm />
      </div>
    </div>
  );
}
