import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { LogIn, MapPin } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onLogin }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
            Welcome to GIS Collaborative
          </DialogTitle>
          <p className="text-slate-600 leading-relaxed">
            Join our real-time collaborative mapping platform. Create, edit, and share geographical data with your team seamlessly.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time collaboration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Advanced drawing tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Multiple map layers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Area calculations</span>
            </div>
          </div>
          
          <Button
            onClick={onLogin}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
          
          <p className="text-xs text-slate-500 text-center mt-4">
            Secure authentication powered by Google
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}