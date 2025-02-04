import { Button } from "./ui/button";
import { Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onReset: () => void;
}

export const Header = ({ onReset }: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <img src="/framly-logo.png" alt="FRAMLY" className="w-12 h-12" />
        <h1 className="text-2xl sm:text-3xl font-bold">FRAMLY</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onReset}>
          <Trash2 className="mr-2 h-4 w-4" />
          {t("resetAll")}
        </Button>
        <Button onClick={() => navigate('/watermark-config')}>
          <Settings className="mr-2 h-4 w-4" />
          {t("watermarkSettingsButton")}
        </Button>
      </div>
    </div>
  );
};