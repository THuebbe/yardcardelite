/**
 * Common type definitions used throughout the application
 */
export type EventType =
  | "birthday"
  | "graduation"
  | "retirement"
  | "wedding"
  | "baby"
  | "anniversary"
  | "holiday"
  | "seasonal"
  | "other";
export type SignStyle =
  | "classic"
  | "modern"
  | "rustic"
  | "elegant"
  | "playful"
  | "minimalist"
  | "vintage"
  | "custom";
export type UserRole = "admin" | "business" | "customer";
export type OrderStatus =
  | "pending"
  | "processing"
  | "deployed"
  | "checkin"
  | "completed"
  | "cancelled";

export interface Address {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
}

export interface SignCondition {
  signId: string;
  serialNumber?: string; // Added to track specific inventory items
  condition: "good" | "damaged";
  notes?: string;
}

export interface PickupInfo {
  pickupDate: string;
  signConditions: SignCondition[];
  notes?: string;
  pickedUpOnTime: boolean;
  lateFee?: number;
  checkedBy: string;
}

/**
 * User-related type definitions
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  phone?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  eventAddress: Address;
  billingAddress?: Address;
}

/**
 * Sign-related type definitions
 */

// Represents a sign allocation to an order
export interface SignAllocation {
  orderId: string;
  quantity: number;
  deliveryDate: string;
  pickupDate: string;
  // Additional dates if needed (e.g., event date)
  eventDate?: string;
}

// Represents inventory status for a sign
export interface SignInventory {
  totalQuantity: number;
  quantityAvailable: number;
  allocations: SignAllocation[];
}

// Main sign interface
export interface Sign {
  id: string;
  serialNumber: string; // Unique identifier for inventory tracking
  name: string;
  eventType: EventType;
  colors: string[]; // Array of colors to support multi-colored signs
  style: SignStyle;
  theme: string; // e.g., "Balloon", "Stars", "Hearts", etc.
  imageUrl: string;
  dimensions?: {
    width: number;
    height: number;
    unit: "inches" | "feet" | "cm" | "m";
  };
  materials?: string[]; // e.g., ["Wood", "Metal", "Plastic"]
  weight?: {
    value: number;
    unit: "lbs" | "kg";
  };
  notes?: string;
  inventory: SignInventory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PreviewSlot {
  id: number;
  sign: Sign | null;
  isNameSlot?: boolean;
}

/**
 * Package-related type definitions
 */
export interface BundlePackage {
  id: string;
  name: string;
  price: number;
  signCount: number;
  setupDaysBefore: number;
  teardownDaysAfter: number;
  extraDayBeforePrice: number;
  extraDayAfterPrice: number;
  isActive: boolean;
  createdAt: string;
}

/**
 * Order-related type definitions
 */
export interface OrderItem {
  id: string;
  signId: string;
  quantity: number;
  price: number;
}

export interface OrderOptions {
  earlyDelivery: boolean;
  latePickup: boolean;
}

// Import from reports.ts to avoid circular dependencies
export interface ReportHistory {
  id: string;
  orderId: string;
  reportType: "pickTicket" | "orderSummary" | "pickupChecklist";
  generatedAt: string;
  generatedBy: string;
  createdAt: string;
  filename: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  orderItems?: OrderItem[];
  previewSlots?: PreviewSlot[];
  customerInfo?: CustomerInfo;
  eventDate?: string;
  options?: OrderOptions;
  packageInfo?: BundlePackage;
  eventForName?: string;
  reports?: ReportHistory[];
  pickupInfo?: PickupInfo;
}

// Form step types
export type FormStep =
  | "customerInfo"
  | "eventDetails"
  | "signCustomization"
  | "payment"
  | "review"
  | "confirmation";

// Event details type
export interface EventDetails {
  eventDate?: Date;
  eventDuration: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  installationTime: "morning" | "afternoon" | "evening";
}

// Sign customization type
export interface SignCustomization {
  text: string;
  backgroundColor: string; // Message Color
  textColor: string; // Name Color
  extraDaysBefore: number;
  extraDaysAfter: number;
  eventMessage: string;
  eventNumber?: number;
  recipientName: string;
  hobbies: string[];
  heroTheme?: string;
}

// Payment information type
export interface PaymentInfo {
  paymentMethod: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  cardNumber: string;
  cardExpiry: string;
}

// Order data type combining all form data
export interface OrderData {
  customerInfo: CustomerInfo;
  eventDetails: EventDetails;
  signCustomization: SignCustomization;
  paymentInfo: PaymentInfo;
  totalPrice: number;
}
