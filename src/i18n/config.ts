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
      "uploadDescription": "Upload your images to process them for social media - includes square cropping, background blur for portrait images, and watermarking.",
      "frameConfiguration": "Frame Configuration",
      "frameConfigDescription": "Upload your logo and bottom images to create a 1080x1080 frame",
      "logoTopLeft": "Logo (Top Left)",
      "logoDescription": "Logo will be placed in the top-left corner (15% of frame size)",
      "bottomImage": "Bottom Image",
      "bottomImageDescription": "Up to 3 images will be placed at the bottom (15% height, 80% total width)",
      "watermarkImage": "Watermark Image",
      "watermarkDescription": "Add a PNG watermark with customizable opacity, size, and position",
      "saveFrameConfiguration": "Save Frame Configuration",
      "opacity": "Opacity",
      "size": "Size (%)",
      "positionX": "Position X (%)",
      "positionY": "Position Y (%)",
      "noImageSelected": "No image selected",
      "backToHome": "Back to Home",
      "watermarkConfigTitle": "Watermark Configuration",
      "watermarkConfigDescription": "Configure your 1080x1080 frame layout with logo and bottom images"
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
      "uploadDescription": "ސޯޝަލް މީޑިއާއަށް ފޮޓޯ ޕްރޮސެސް ކުރުމަށް ފޮޓޯ އަޕްލޯޑް ކުރައްވާ - ހިމެނެނީ ހަތަރެސްކަން ކްރޮޕިންގ، ޕޯޓްރެއިޓް ފޮޓޯތަކަށް ބެކްގްރައުންޑް ބްލަރ، އަދި ވޯޓަރމާކް",
      "frameConfiguration": "ފްރޭމް ކޮންފިގަރޭޝަން",
      "frameConfigDescription": "1080x1080 ފްރޭމެއް ހެދުމަށް ލޯގޯ އަދި ތިރީގެ ފޮޓޯތައް އަޕްލޯޑް ކުރައްވާ",
      "logoTopLeft": "ލޯގޯ (މަތީ ވައަތު ކަނުގައި)",
      "logoDescription": "ލޯގޯ ބެހެއްޓޭނީ މަތީ ވައަތު ކަނުގައި (ފްރޭމްގެ 15%)",
      "bottomImage": "ތިރީގެ ފޮޓޯ",
      "bottomImageDescription": "ތިރީގައި ބެހެއްޓޭނީ 3 ފޮޓޯ (އުސްމިނުގައި 15%، ޖުމްލަ ފުޅާމިނުގައި 80%)",
      "watermarkImage": "ވޯޓަރމާކް ފޮޓޯ",
      "watermarkDescription": "އޯޕަސިޓީ، ސައިޒް، އަދި ޕޮޒިޝަން ބަދަލުކުރެވޭ PNG ވޯޓަރމާކެއް އިތުރުކުރައްވާ",
      "saveFrameConfiguration": "ފްރޭމް ކޮންފިގަރޭޝަން ސޭވްކުރައްވާ",
      "opacity": "އޯޕަސިޓީ",
      "size": "ސައިޒް (%)",
      "positionX": "ޕޮޒިޝަން X (%)",
      "positionY": "ޕޮޒިޝަން Y (%)",
      "noImageSelected": "ފޮޓޯއެއް ހޮވިފައެއް ނުވޭ",
      "backToHome": "މައި ޞަފްޙާއަށް",
      "watermarkConfigTitle": "ވޯޓަރމާކް ކޮންފިގަރޭޝަން",
      "watermarkConfigDescription": "ލޯގޯ އަދި ތިރީގެ ފޮޓޯތަކާއެކު 1080x1080 ފްރޭމް ލޭއައުޓް ކޮންފިގަރ ކުރައްވާ"
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