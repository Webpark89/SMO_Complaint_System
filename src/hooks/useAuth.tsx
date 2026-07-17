import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  mockAuth,
  type MockSession,
  type MockUser,
} from "@/services/mock/auth";
import { getUserPermissions } from "@/mock/roles/roles.mock";

export type AppRole =
  | "super-admin"
  | "admin"
  | "hr"
  | "compliance"
  | "manager"
  | "auditor"
  | "employee"
  | "cs";

interface AuthCtx {
  user: MockUser | null;
  session: MockSession | null;
  roles: AppRole[];
  loading: boolean;
  isStaff: boolean;
  canViewSensitive: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInMock?: () => void;
  signInAdminMock?: () => void;
  signOutMock?: () => void;
  hasAnyRole: (allowed: AppRole[]) => boolean;
  hasPermission: (permissionOrPage: string, action?: string) => boolean;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = mockAuth.subscribe((nextSession) => {
      applySession(nextSession);
    });

    mockAuth.getSession().then((nextSession) => {
      applySession(nextSession);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function applySession(nextSession: MockSession | null) {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
    setRoles(nextSession ? mockAuth.getRoles(nextSession.user.id) : []);
  }

  const isStaff = roles.some((r) =>
    ["super-admin", "admin", "hr", "compliance", "manager", "auditor", "cs"].includes(r)
  );
  
  const canViewSensitive = roles.some((r) =>
    ["super-admin", "admin", "compliance"].includes(r)
  );

  // ฟังก์ชันเช็คสิทธิ์ที่เพิ่มเข้ามาใหม่
  const hasAnyRole = (allowed: AppRole[]) => {
    return roles.some((r) => allowed.includes(r));
  };

  const hasPermission = (permissionOrPage: string, action?: string): boolean => {
    if (roles.includes("super-admin") || roles.includes("admin")) {
      return true;
    }
    const userPermissions = getUserPermissions(roles);

    if (action) {
      return userPermissions.includes(`${permissionOrPage}:${action}`);
    }

    // Mapping สำหรับรองรับการใช้งานรูปแบบเดิม (Backward Compatibility)
    const oldPermissionsMapping: Record<string, string[]> = {
      view_complaints: [
        "complaint_list:view",
        "complaint_intake:view",
        "complaint_assignment:view",
        "complaint_investigation:view",
        "complaint_approval:view",
        "complaint_extension:view",
        "sensitive_cases:view",
        "documents_evidence:view",
      ],
      create_complaints: [
        "complaint_intake:create",
        "complaint_assignment:create",
        "complaint_investigation:create",
        "complaint_extension:create",
        "documents_evidence:upload",
      ],
      edit_complaints: [
        "complaint_list:edit",
        "complaint_assignment:edit",
        "complaint_assignment:assign",
        "complaint_investigation:edit",
        "complaint_investigation:investigate",
        "complaint_approval:edit",
        "complaint_approval:approve",
        "complaint_extension:edit",
        "complaint_extension:approve",
        "documents_evidence:edit",
      ],
      delete_complaints: [
        "complaint_list:delete",
        "complaint_assignment:delete",
        "complaint_investigation:delete",
        "complaint_approval:delete",
        "complaint_extension:delete",
        "documents_evidence:delete",
      ],
      investigate_complaints: ["complaint_investigation:investigate", "complaint_extension:approve"],
      approve_complaints: ["complaint_approval:approve"],
      view_reports: [
        "report_summary:view",
        "report_sla:view",
        "report_investigation:view",
        "report_executive:view",
        "report_audit_log:view",
      ],
      export_reports: [
        "report_summary:export",
        "report_sla:export",
        "report_investigation:export",
        "report_executive:export",
        "report_audit_log:export",
      ],
      manage_users: ["users:view", "users:create", "users:edit", "users:delete"],
      manage_roles: [
        "roles_permissions:view",
        "roles_permissions:create",
        "roles_permissions:edit",
        "roles_permissions:delete",
      ],
      manage_settings: [
        "categories:view",
        "categories:create",
        "categories:edit",
        "categories:delete",
        "subcategories:view",
        "subcategories:create",
        "subcategories:edit",
        "subcategories:delete",
        "forms:view",
        "forms:create",
        "forms:edit",
        "forms:delete",
        "termandprivacy:view",
        "termandprivacy:edit",
        "sla:view",
        "sla:create",
        "sla:edit",
        "sla:delete",
        "organizations:view",
        "organizations:create",
        "organizations:edit",
        "organizations:delete",
        "audit_logs:view",
      ],
    };

    if (permissionOrPage in oldPermissionsMapping) {
      return oldPermissionsMapping[permissionOrPage].some((p) =>
        userPermissions.includes(p)
      );
    }

    return userPermissions.includes(permissionOrPage);
  };

  async function signIn(email: string, password: string) {
    await mockAuth.signIn(email, password);
  }

  async function signUp(email: string, password: string, fullName?: string) {
    await mockAuth.signUp(email, password, fullName);
  }

  async function signOut() {
    await mockAuth.signOut();
  }

  function signInMock() {
    mockAuth.signInDemo();
  }

  function signInAdminMock() {
    mockAuth.signInAdminDemo();
  }

  function signOutMock() {
    void signOut();
  }

  // Return แค่ครั้งเดียว ด้านล่างสุดของ Component
  return (
    <Ctx.Provider
      value={{
        user,
        session,
        roles,
        loading,
        isStaff,
        canViewSensitive,
        signIn,
        signUp,
        signOut,
        signInMock,
        signInAdminMock,
        signOutMock,
        hasAnyRole,
        hasPermission,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}