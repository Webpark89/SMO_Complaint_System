import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import loginBg from "@/assets/logo-smo-2.svg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "เข้าสู่ระบบ — บริษัท กลุ่มสมอทอง จำกัด (มหาชน)" },
      {
        name: "description",
        content: "เข้าสู่ระบบเพื่อจัดการเรื่องร้องเรียนของท่าน",
      },
    ],
  }),
  component: AuthPage,
});

const credSchema = z.object({
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง").max(255),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร").max(128),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, roles, signIn, signInAdminMock } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin =
    roles.includes("super-admin") ||
    user?.user_metadata?.role === "super-admin";

  useEffect(() => {
    if (user && isAdmin) {
      clearPostLoginRedirectState();
      navigate({ to: "/admin", replace: true });
    }
  }, [isAdmin, user, navigate]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setLoading(true);
    try {
      await signIn(email, password);
      clearPostLoginRedirectState();
      toast.success("ยินดีต้อนรับกลับ");
      navigate({ to: "/admin", replace: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left Branding Panel */}
      <div className="relative hidden overflow-hidden bg-primary bg-cover bg-center md:flex md:flex-col md:justify-between md:p-12 text-primary-foreground" style={{ backgroundImage: `url(${loginBg})` }}>
        <div className="absolute inset-0 opacity-[0.07] auth-hero-grid" />
        <Link to="/" className="relative inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 backdrop-blur">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display font-bold">
              บริษัท กลุ่มสมอทอง จำกัด (มหาชน)
            </div>
            <div className="text-[10px] tracking-[0.12em] opacity-70">
              ระบบรับเรื่องร้องเรียน
            </div>
          </div>
        </Link>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            ระบบจัดการเรื่องร้องเรียนออนไลน์
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            เข้าสู่ระบบเพื่อจัดการเรื่องร้องเรียน ตรวจสอบรายงาน
            และติดตามผลการดำเนินการขององค์กร
          </p>
        </div>
        <div className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} บริษัท กลุ่มสมอทอง จำกัด (มหาชน)
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-col justify-center bg-background p-6 md:p-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground md:hidden"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> ย้อนกลับ
          </Link>

          <h1 className="mt-4 font-display text-3xl font-bold md:mt-0">
            ยินดีต้อนรับ
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            จัดการและตรวจสอบเรื่องร้องเรียนที่ได้รับมอบหมายให้กับทีมของท่าน
          </p>

          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "signin" | "signup")}
            className="mt-8"
          >
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label>อีเมล</Label>
                  <Input
                    className="mt-1.5"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label>รหัสผ่าน</Label>
                  <Input
                    className="mt-1.5"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
                </Button>

                {import.meta.env.DEV && signInAdminMock && (
                  <div className="mt-3 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        signInAdminMock();
                        clearPostLoginRedirectState();
                        toast.success("เข้าสู่ระบบ Admin ชั่วคราวเรียบร้อย");
                        navigate({ to: "/admin/dashboard", replace: true });
                      }}
                    >
                      เข้าสู่ระบบ Admin (ชั่วคราว)
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>

          {/* Separator */}
          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">หรือ</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Anonymous Submission */}
          <div className="mt-8">
            {/* <p className="mb-3 text-sm text-muted-foreground">
              ส่งเรื่องร้องเรียนโดยไม่ต้องเพิ่มบัญชี
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                navigate({
                  to: "/SubmitComplaintRoute",
                  search: { mode: "anonymous" },
                })
              }
            >
              ส่งเรื่องร้องเรียนแบบไม่ระบุตัวตน
            </Button> */}

            {/* Optional: Google Login */}
            <div className="mt-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => console.log("Google login")}
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                Continue with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function clearPostLoginRedirectState() {
  if (typeof window === "undefined") return;

  const keys = [
    "redirectTo",
    "from",
    "postLoginRedirect",
    "authRedirect",
    "returnUrl",
  ];
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      for (const key of keys) {
        storage.removeItem(key);
      }
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }
}
