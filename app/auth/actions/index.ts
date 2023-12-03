"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUpWithEmailAndPassword(data: {
	email: string;
	password: string;
	confirm: string;
}) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.auth.signUp({
		email: data.email,
		password: data.password,
	});
	return JSON.stringify(result);
}

export async function signInWithEmailAndPassword(data: {
	email: string;
	password: string;
}) {
	const supabase = await createSupabaseServerClient();
	const result = await supabase.auth.signInWithPassword(data);
    console.log(result)
	return JSON.stringify(result);
}

export async function signUpWithEmail(data: {
	email: string;
}) {
	const supabase = await createSupabaseServerClient();
	const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/profile`,
      }
    });
    
	return JSON.stringify({ error });
}


export async function loginWithGoogle() {
	const supabase = await createSupabaseServerClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })
      console.log(data)
}

//https://klzoutquzrmwwgifgzno.supabase.co/auth/v1/callback