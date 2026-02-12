import CustomButton from "@/components/utils/buttons/CustomButton";
import Link from "next/link";

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
