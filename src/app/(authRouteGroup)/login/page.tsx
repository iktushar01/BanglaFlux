import LoginForm from "@/components/modules/auth/LoginForm";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

/**
 * Auth login page
 * This server component unwraps searchParams and passes the 
 * redirect destination to the Client-side LoginForm.
 */
const LoginPage = async ({ searchParams }: LoginParams) => {
  const { redirect: redirectPath } = await searchParams;

  return (
    <div className="relative min-h-screen w-full">
      <LoginForm redirectPath={redirectPath} />
    </div>
  );
};

export default LoginPage;