
export enum CaseType {
  IMPLANT = 'Implant',
  CROWN = 'Crown',
  SURGERY = 'Surgery',
  ORTHO = 'Ortho',
  CHECKUP = 'Routine Checkup',
  CLEANING = 'Cleaning',
  WHITENING = 'Whitening',
  VENEERS = 'Veneers',
  ROOT_CANAL = 'Root Canal',
  EXTRACTION = 'Extraction',
  FILLING = 'Filling',
  DENTURES = 'Dentures',
  GUM_TREATMENT = 'Gum Treatment',
  PEDIATRIC = 'Pediatric',
  SMILE_MAKEOVER = 'Smile Makeover'
}

export enum HesitationReason {
  PRICE = 'Price',
  FEAR = 'Fear',
  CONFUSION = 'Confusion'
}

export enum UrgencyLevel {
  NORMAL = 'Normal',
  IMPORTANT = 'Important',
  URGENT = 'Urgent'
}

export enum Language {
  AR_EGY = 'Arabic (Egyptian)',
  AR_SAU = 'Arabic (Saudi)',
  AR_LEV = 'Arabic (Levantine)',
  AR_EMR = 'Arabic (Emirati)',
  AR_MAR = 'Arabic (Maghrebi)',
  EN = 'English',
  FR = 'French',
  DE = 'German'
}

export interface CaseData {
  caseType: CaseType;
  hesitationReason: HesitationReason;
  urgencyLevel: UrgencyLevel;
  language: Language;
  price?: string;
  patientName: string;
  clinicName: string;
}
