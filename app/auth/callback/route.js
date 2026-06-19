import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Auto-add first user as admin if no admins exist
      const { data: existingAdmins } = await supabase
        .from("admin_users")
        .select("id")
        .limit(1);

      if (!existingAdmins || existingAdmins.length === 0) {
        await supabase.from("admin_users").insert({
          user_id: data.user.id,
          email: data.user.email,
          display_name: data.user.user_metadata?.full_name || data.user.email,
          avatar_url: data.user.user_metadata?.avatar_url || null,
          role: "admin",
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
