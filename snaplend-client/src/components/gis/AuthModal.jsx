import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import AuthApi from "../../api/auth-api";
import { useToast } from "../ui/use-toast";
import { X } from "lucide-react";

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", display_name: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setMode("login");
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const userData = await AuthApi.login({
          email: form.email,
          password: form.password,
        });
        toast({ title: "Success", description: "You are now logged in." });
        onClose(userData);
      } else {
        const userData = await AuthApi.register({
          email: form.email,
          password: form.password,
          display_name: form.display_name,
        });
        toast({ title: "Account created", description: "You are now logged in." });
        onClose(userData);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data || err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }   
  };

  const handleClose = () =>{
    onClose(null);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000] backdrop-blur-sm bg-white/20">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-xl animate-fade-in">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-sky-700">
              {mode === "login" ? "Login to Your Account" : "Create a New Account"}
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClose}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <Label htmlFor="display_name">Full Name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  placeholder="John Doe"
                  value={form.display_name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-500">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <Button variant="link" onClick={() => setMode("register")}>
                  Register here
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button variant="link" onClick={() => setMode("login")}>
                  Login here
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
