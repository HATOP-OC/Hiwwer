import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={i18n.language === "en" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => changeLanguage("en")}
      >
        EN
      </Button>
      <Button
        variant={i18n.language === "uk" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => changeLanguage("uk")}
      >
        UA
      </Button>
    </div>
  );
}