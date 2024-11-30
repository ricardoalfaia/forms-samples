import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div className="flex justify-center flex-col items-center align-middle">
      <div className="text-center">
        <h1 className="text-2xl">{t("title")}</h1>
        <Link href="/checkout" className="underline text-blue-700">
          {t("checkout")}
        </Link>
      </div>
    </div>
  );
}
