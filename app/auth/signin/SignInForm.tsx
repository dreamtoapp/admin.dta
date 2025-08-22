"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email({ message: "يرجى إدخال عنوان بريد إلكتروني صحيح" }),
  password: z.string().min(6, { message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل" }),
});

type SignInValues = z.infer<typeof schema>;

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: SignInValues) => {
    setError("");
    form.clearErrors();

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setError("بيانات الاعتماد غير صحيحة. يرجى المحاولة مرة أخرى.");
      return;
    }

    const session = await getSession();
    const role = session?.user?.role?.toUpperCase();
    if (role === "ADMIN") router.push("/dashboard/admin");
    else if (role === "STAFF") router.push("/dashboard/staff");
    else router.push("/dashboard/client");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm text-right">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right block">البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    autoComplete="email"
                    className="text-right"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right block">كلمة المرور</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور"
                      autoComplete="current-password"
                      className="text-right pr-20"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute left-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? "إخفاء" : "إظهار"}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>
    </Form>
  );
}
