/**
 * API Client — real HTTP layer for the complaint backend.
 *
 * Swappable with the mock layer by swapping the import in ComplaintService.ts.
 * Configure BASE_URL via VITE_API_BASE_URL env var (defaults to relative path).
 */

const BASE_URL =
  typeof import.meta.env.VITE_API_BASE_URL === "string"
    ? import.meta.env.VITE_API_BASE_URL
    : "/api";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    ...init,
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }

  if (!res.ok) {
    throw new ApiError(`API ${res.status}: ${path}`, res.status, body);
  }

  return body as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────

export type ApiSession = {
  user: {
    id: string;
    email: string;
    user_metadata: { full_name?: string; role?: string };
  };
  access_token: string;
};

export const apiAuth = {
  async getSession(): Promise<ApiSession | null> {
    return request<ApiSession | null>("/auth/session");
  },

  async signIn(email: string, password: string) {
    return request<{ session: ApiSession }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async signUp(email: string, password: string, fullName?: string) {
    return request<{ session: ApiSession }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName }),
    });
  },

  async signOut() {
    return request<void>("/auth/signout", { method: "POST" });
  },
};

// ─── Complaints ─────────────────────────────────────────────────────────────

export type ApiComplaint = {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  category_id: string | null;
  subtopic_id: string | null;
  subtopic_other: string | null;
  subcategory_other: string | null;
  product_type: string | null;
  product_type_other: string | null;
  lot_reference: string | null;
  contract_number: string | null;
  delivery_date: string | null;
  occurred_date: string | null;
  occurred_time: string | null;
  location: string | null;
  priority: string;
  status: string;
  is_anonymous: boolean;
  is_sensitive: boolean;
  hasWitness: boolean;
  witnessNames: string[];
  urgencyLevel: string;
  requestFollowUp: boolean;
  followUpContact: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_phone: string | null;
  reporter_department: string | null;
  reporter_user_id: string | null;
  assignee_id: string | null;
  track_token: string;
  created_at: string;
  updated_at: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  description: string | null;
  is_sensitive: boolean;
  active: boolean;
  created_at: string;
};

export type ApiComment = {
  id: string;
  complaint_id: string;
  author_id: string | null;
  author_name: string | null;
  body: string;
  is_internal: boolean;
  created_at: string;
};

export type ApiStatusHistory = {
  id: string;
  complaint_id: string;
  from_status: string | null;
  to_status: string;
  changed_by: string | null;
  note: string | null;
  created_at: string;
};

export const apiComplaints = {
  list() {
    return request<ApiComplaint[]>("/complaints");
  },

  getById(id: string) {
    return request<ApiComplaint>(`/complaints/${id}`);
  },

  getByReference(ref: string) {
    return request<ApiComplaint>(`/complaints/by-ref/${ref}`);
  },

  create(data: Record<string, unknown>) {
    return request<{ id: string; reference_number: string }>("/complaints", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<ApiComplaint>) {
    return request<ApiComplaint>(`/complaints/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  updateStatus(id: string, status: string) {
    return request<void>(`/complaints/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  delete(id: string) {
    return request<void>(`/complaints/${id}`, { method: "DELETE" });
  },
};

export const apiCategories = {
  list() {
    return request<ApiCategory[]>("/categories");
  },

  getById(id: string) {
    return request<ApiCategory>(`/categories/${id}`);
  },
};

export const apiComments = {
  list(complaintId: string) {
    return request<ApiComment[]>(`/complaints/${complaintId}/comments`);
  },

  create(complaintId: string, body: string, isInternal: boolean) {
    return request<ApiComment>(`/complaints/${complaintId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body, is_internal: isInternal }),
    });
  },
};

export const apiHistory = {
  list(complaintId: string) {
    return request<ApiStatusHistory[]>(`/complaints/${complaintId}/history`);
  },
};
