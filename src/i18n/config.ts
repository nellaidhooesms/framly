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
      "watermarkSettings": "Watermark Settings",
      "socialMediaImageProcessor": "Social Media Image Processor",
      "resetAll": "Reset All",
      "watermarkSettingsButton": "Watermark Settings",
      "textConfiguration": "Text Configuration",
      "imageDescription": "Image Description",
      "enterImageDescription": "Enter image description",
      "textDirection": "Text Direction",
      "leftToRight": "Left to Right",
      "rightToLeft": "Right to Left",
      "preview": "Preview",
      "enterTextToPreview": "Enter text to preview",
      "uploadDescription": "Upload your images to process them for social media - includes square cropping, background blur for portrait images, and watermarking."
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
      "watermarkSettings": "ވޯޓަރމާކް ސެޓިންގްސް",
      "socialMediaImageProcessor": "ސޯޝަލް މީޑިއާ އިމޭޖް ޕްރޮސެސަރ",
      "resetAll": "އަލުން ފަށާ",
      "watermarkSettingsButton": "ވޯޓަރމާކް ސެޓިންގްސް",
      "textConfiguration": "ޓެކްސްޓް ކޮންފިގަރޭޝަން",
      "imageDescription": "ފޮޓޯގެ ތަފްސީލް",
      "enterImageDescription": "ފޮޓޯގެ ތަފްސީލް ލިޔުއްވާ",
      "textDirection": "ޓެކްސްޓްގެ ދިމާލުން",
      "leftToRight": "ވައަތުން ކަނާތަށް",
      "rightToLeft": "ކަނާތުން ވައަތަށް",
      "preview": "ޕްރިވިއު",
      "enterTextToPreview": "ޕްރިވިއު ކުރުމަށް ޓެކްސްޓް ލިޔުއްވާ",
      "uploadDescription": "ސޯޝަލް މީޑިއާއަށް ފޮޓޯ ޕްރޮސެސް ކުރުމަށް ފޮޓޯ އަޕްލޯޑް ކުރައްވާ - ހިމެނެނީ ހަތަރެސްކަން ކްރޮޕިންގ، ޕޯޓްރެއިޓް ފޮޓޯތަކަށް ބެކްގްރައުންޑް ބްލަރ، އަދި ވޯޓަރމާކް"
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