export type BrandingColors = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

export const initialBrandingColors: BrandingColors = {
  primaryColor: "#B08D57",
  secondaryColor: "#D4AF37",
  accentColor: "#C9A227",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
};

export type LogoAssets = {
  mainLogo: string | null;
  whiteLogo: string | null;
  darkLogo: string | null;
  favicon: string | null;
  loginLogo: string | null;
};

export const initialLogos: LogoAssets = {
  mainLogo: "mock://main-logo",
  whiteLogo: "mock://white-logo",
  darkLogo: "mock://dark-logo",
  favicon: "mock://favicon",
  loginLogo: "mock://login-logo",
};

export const initialLogoGuidelines = {
  purpose: "กำหนดแนวทางการใช้โลโก้เพื่อคงเอกลักษณ์และความเป็นมืออาชีพ",
  usageRequirements: "หลีกเลี่ยงการบิดเบือนสี/ขนาด และต้องคงความชัดเจนของโลโก้",
  usageScope: "ใช้สำหรับเว็บไซต์ เอกสารภายใน และสื่อประชาสัมพันธ์",
  prohibited: "ห้ามยืด/ย่อผิดสัดส่วน ห้ามใส่พื้นหลังที่ทำให้โลโก้ไม่ชัดเจน",
};

export type BrandConfiguration = {
  companyName: string;
  companySlogan: string;
  corporateFont: string;
  emailSignature: string;
  documentHeader: string;
  documentFooter: string;
  brandDescription: string;
};

export const initialBrandConfiguration: BrandConfiguration = {
  companyName: "บริษัท กลุ่มสมอทอง จำกัด (มหาชน)",
  companySlogan: "ช่องทางรับเรื่องร้องเรียนอย่างโปร่งใสและเป็นธรรม",
  corporateFont: "Prompt",
  emailSignature: "— Team Complaint Management",
  documentHeader: "Complaint Management / Admin",
  documentFooter: "Confidential — Internal Use",
  brandDescription:
    "แพลตฟอร์มบริหารจัดการเรื่องร้องเรียนเพื่อสนับสนุนการตรวจสอบและการตัดสินใจที่รอบคอบ",
};
