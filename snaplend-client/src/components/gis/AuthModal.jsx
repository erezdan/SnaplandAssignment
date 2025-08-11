import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import AuthApi from "../../api/auth-api";
import AuthService from "../../services/auth-service";
import { useToast } from "../ui/use-toast";

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  console.log('AuthModal render - open:', open, 'mode:', mode);

  useEffect(() => {
    console.log('AuthModal useEffect - open changed to:', open);
    if (open) {
      console.log('AuthModal opened - setting mode to register');
      setMode("register"); // Default to register mode when no user exists
    }
  }, [open]);

  useEffect(() => {
    console.log('AuthModal component mounted');
    return () => {
      console.log('AuthModal component unmounted');
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const result = await AuthApi.login({
          email: form.email,
          password: form.password,
        });
        // Don't call AuthService.onLogin here since auth-api.js already does it
        toast({
          title: "Success",
          description: "You are now logged in.",
        });
        onClose();
      } else {
        const result = await AuthApi.register({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
        });
        // Don't call AuthService.onLogin here since auth-api.js already does it
        toast({
          title: "Account created",
          description: "You are now logged in.",
        });
        onClose();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Login to Your Account" : "Create a New Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="John Doe"
                value={form.full_name}
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
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
      </DialogContent>
    </Dialog>
  );
}
