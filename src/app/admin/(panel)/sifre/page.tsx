import { PasswordForm } from "@/components/admin/settings-forms";
import { Card, PageTitle } from "@/components/admin/ui";

export const metadata = { title: "Şifre belirle" };

export default function PasswordPage() {
  return (
    <>
      <PageTitle title="Şifre belirle" description="Davet veya şifre sıfırlama bağlantısıyla geldiyseniz yeni şifrenizi belirleyin." />
      <Card className="max-w-md p-5 sm:p-6">
        <PasswordForm />
      </Card>
    </>
  );
}
