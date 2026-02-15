import Link from 'next/link';

import CustomButton from '@/components/utils/buttons/CustomButton';

export default function LoginPage() {
  return (
    <div>
      <p>Login Page</p>
      <Link href="/">
        <CustomButton>Home page</CustomButton>
      </Link>
    </div>
  );
}
