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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
      <div className="flex items-center gap-3 group">
        <img 
          src="/framly-logo.png" 
          alt="FRAMLY" 
          className="w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" 
        />
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          FRAMLY
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="hover-lift smooth-transition group"
        >
          <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          {t("resetAll")}
        </Button>
        <Button 
          onClick={() => navigate('/watermark-config')}
          className="hover-lift smooth-transition group"
        >
          <Settings className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          {t("watermarkSettingsButton")}
        </Button>
      </div>
    </div>
  );
};