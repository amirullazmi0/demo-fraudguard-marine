"use client";

import { useActionState } from "react";
import { Anchor, Loader2, LogIn } from "lucide-react";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
     const [state, action, pending] = useActionState(loginAction, undefined);
     return (
          <main className="flex min-h-screen items-center justify-center bg-[#f4f8fb] px-5 py-10">
               <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                         <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-700 text-white">
                              <Anchor className="h-6 w-6" />
                         </div>
                         <CardTitle className="text-xl">Masuk ke MarineGuard</CardTitle>
                         <p className="mt-2 text-sm text-slate-500">
                              Intelijen pemeliharaan for maritime operations.
                         </p>
                    </CardHeader>
                    <CardContent>
                         <form action={action} className="space-y-5">
                              <div className="space-y-2">
                                   <Label htmlFor="email">Email</Label>
                                   <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@marineguard.demo"
                                        required
                                   />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="password">Password</Label>
                                   <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                   />
                              </div>
                              {state?.error && (
                                   <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                        {state.error}
                                   </p>
                              )}
                              <Button type="submit" disabled={pending} className="w-full">
                                   {pending ? (
                                        <>
                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                             Signing in…
                                        </>
                                   ) : (
                                        <>
                                             <LogIn className="mr-2 h-4 w-4" />
                                             Sign in
                                        </>
                                   )}
                              </Button>
                         </form>
                         <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                              <strong>Akses demo</strong>
                              <br />
                              Admin: admin@marineguard.demo / Admin123!
                              <br />
                              ABK: abk@marineguard.demo / Abk123!
                         </div>
                    </CardContent>
               </Card>
          </main>
     );
}
