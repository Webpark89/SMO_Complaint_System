/**
 * Utilities for anonymous complaint submission
 * Generates reference numbers and PINs for anonymous users
 */

/**
 * Generate a unique reference number in format: CMP-YYYY-XXXXX
 * YYYY = current year
 * XXXXX = 5-digit random number
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `CMP-${year}-${random}`;
}

/**
 * Generate a numeric PIN (6 digits)
 * Format: XXXXXX (e.g., 485923)
 */
export function generatePIN(): string {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
}

/**
 * Mock email sending for anonymous complaint submission
 * In production, integrate with email service (SendGrid, Mailgun, etc.)
 */
export async function sendAnonymousComplaintEmail(
  email: string,
  referenceNumber: string,
  pin: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Mock: simulate email send delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Store in localStorage for demo purposes
    const stored = JSON.parse(
      localStorage.getItem("anonymous_submissions") || "{}",
    );
    stored[referenceNumber] = {
      email,
      pin,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("anonymous_submissions", JSON.stringify(stored));

    // Log for debugging
    console.log(`[Mock Email Sent] To: ${email}`);
    console.log(`Reference: ${referenceNumber}`);
    console.log(`PIN: ${pin}`);

    return {
      success: true,
      message: `อีเมลยืนยันได้ถูกส่งไปยัง ${email}`,
    };
  } catch (error) {
    return {
      success: false,
      message: "เกิดข้อผิดพลาดในการส่งอีเมล",
    };
  }
}

/**
 * Validate anonymous complaint credentials
 */
export function validateAnonymousCredentials(
  referenceNumber: string,
  pin: string,
): boolean {
  try {
    const stored = JSON.parse(
      localStorage.getItem("anonymous_submissions") || "{}",
    );
    const submission = stored[referenceNumber];

    if (!submission) {
      console.error("Reference number not found");
      return false;
    }

    if (submission.pin !== pin) {
      console.error("PIN mismatch");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}

/**
 * Store anonymous complaint for later retrieval
 * This would be backend in production
 */
type AnonymousComplaintRecord = {
  referenceNumber: string;
  pin: string;
  complaintData: Record<string, unknown>;
  createdAt: string;
  status: "pending";
};

type AnonymousComplaintSubmission = {
  email: string;
  pin: string;
  createdAt: string;
};

type AnonymousSubmissionsStore = Record<string, AnonymousComplaintSubmission>;

type AnonymousComplaintsStore = Record<string, AnonymousComplaintRecord>;

export function storeAnonymousComplaint(
  referenceNumber: string,
  pin: string,
  complaintData: Record<string, unknown>,
): void {
  try {
    const stored = JSON.parse(
      localStorage.getItem("anonymous_complaints") || "{}",
    );
    stored[referenceNumber] = {
      referenceNumber,
      pin,
      complaintData,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    localStorage.setItem("anonymous_complaints", JSON.stringify(stored));
  } catch (error) {
    console.error("Error storing complaint:", error);
  }
}

/**
 * Retrieve anonymous complaint by reference number and PIN
 */
export function retrieveAnonymousComplaint(
  referenceNumber: string,
  pin: string,
): AnonymousComplaintRecord | null {
  try {
    const stored = JSON.parse(
      localStorage.getItem("anonymous_complaints") || "{}",
    );
    const complaint = stored[referenceNumber];

    if (!complaint || complaint.pin !== pin) {
      return null;
    }

    return complaint;
  } catch (error) {
    console.error("Error retrieving complaint:", error);
    return null;
  }
}

export default {
  generateReferenceNumber,
  generatePIN,
  sendAnonymousComplaintEmail,
  validateAnonymousCredentials,
  storeAnonymousComplaint,
  retrieveAnonymousComplaint,
};
