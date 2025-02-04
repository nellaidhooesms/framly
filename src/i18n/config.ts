import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "processImage": "Process",
      "processing": "Processing...",
      "uploadImages": "Upload Images",
      "dragDrop": "Drag and drop images here, or click to select files",
      "processAll": "Process All",
      "downloadAll": "Download All",
      "downloadSeparately": "Download Separately",
      "reset": "Reset All",
      "watermarkSettings": "Watermark Settings"
    }
  },
  dv: {
    translation: {
      "processImage": "ޕްރޮސެސް",
      "processing": "ޕްރޮސެސް ކުރަނީ...",
      "uploadImages": "ފޮޓޯ އަޕްލޯޑް ކުރުން",
      "dragDrop": "ފޮޓޯ މިތަނަށް ދެމާލާ ނުވަތަ ފޮޓޯ ހޮވުމަށް ފިތާލާ",
      "processAll": "ހުރިހާ ފޮޓޯއެއް ޕްރޮސެސް ކުރުން",
      "downloadAll": "ހުރިހާ ފޮޓޯއެއް ޑައުންލޯޑް ކުރުން",
      "downloadSeparately": "ވަކިވަކިން ޑައުންލޯޑް ކުރުން",
      "reset": "އަލުން ފަށާ",
      "watermarkSettings": "ވޯޓަރމާކް ސެޓިންގްސް"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;