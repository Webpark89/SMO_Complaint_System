// Intentionally no react imports; we use the DOM File type

export type CaptchaResult = { ok: boolean };

/**
 * Mock CAPTCHA integration.
 * In production: call backend to verify token.
 */
export async function verifyCaptchaMock(
  _captchaToken?: string,
): Promise<CaptchaResult> {
  return { ok: true };
}

/**
 * Mock rate limiting.
 * In production: use IP/session + endpoint key.
 */
export async function assertRateLimitMock(_key: string): Promise<void> {
  return;
}

/**
 * Mock CSRF protection hook.
 * In production: validate CSRF token server-side.
 */
export function getCsrfTokenMock(): string {
  // For demo only. Real apps should obtain via <meta> or cookie.
  return "mock-csrf-token";
}

export type FileValidationResult = {
  ok: boolean;
  errors: string[];
};

export function validateFileTypeAndSizeMock(args: {
  files: File[];
  allowedMimeTypes: string[];
  maxFileSizeBytes: number;
  maxFiles: number;
}): FileValidationResult {
  const errors: string[] = [];
  const { files, allowedMimeTypes, maxFileSizeBytes, maxFiles } = args;

  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum is ${maxFiles}.`);
  }

  for (const f of files.slice(0, maxFiles)) {
    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(f.type)) {
      errors.push(`Unsupported file type: ${f.name}`);
    }
    if (f.size > maxFileSizeBytes) {
      errors.push(`File too large: ${f.name}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Mock virus scanning hook.
 * In production: forward to scanning service and wait for verdict.
 */
export async function scanFileForVirusMock(
  _file: File,
): Promise<{ infected: boolean }> {
  return { infected: false };
}

/**
 * Mock audit logging.
 * In production: store structured audit events server-side.
 */
export type AuditEvent = {
  eventType: string;
  trackingNumber?: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
  userRole?: string;
  isAnonymous?: boolean;
};

export async function writeAuditLogMock(_event: AuditEvent): Promise<void> {
  // no-op in mock layer; keep as integration point
  return;
}
