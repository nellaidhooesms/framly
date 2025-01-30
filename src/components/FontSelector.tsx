import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  onCustomFontUpload: (file: File) => void;
}

const GOOGLE_FONTS = [
  "Arial",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Playfair Display",
  "Source Sans Pro",
];

export const FontSelector = ({
  selectedFont,
  onFontChange,
  onCustomFontUpload,
}: FontSelectorProps) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.otf') || file.name.endsWith('.ttf'))) {
      onCustomFontUpload(file);
    } else {
      toast.error("Please upload a valid font file (.otf or .ttf)");
    }
  };

  return (
    <div className="space-y-4">
      <Select value={selectedFont} onValueChange={onFontChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {GOOGLE_FONTS.map((font) => (
            <SelectItem key={font} value={font}>
              <span style={{ fontFamily: font }}>{font}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".otf,.ttf"
          onChange={handleFileChange}
          className="hidden"
          id="font-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('font-upload')?.click()}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Custom Font (Thaana Support)
        </Button>
      </div>
    </div>
  );
};