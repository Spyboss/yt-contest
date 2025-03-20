import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-500 hover:bg-blue-600',
            footerActionLink: 'text-blue-500 hover:text-blue-600',
          },
        }}
      />
    </div>
  );
} 