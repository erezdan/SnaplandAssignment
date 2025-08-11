import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  X, 
  Users, 
  Circle,
  Clock,
  Palette
} from "lucide-react";

export default function ActiveUsers({ users, currentUser, onClose }) {
  const activeUsers = users.filter(user => user.isActive);
  const inactiveUsers = users.filter(user => !user.isActive);

  return (
    <Card className="absolute right-4 top-32 w-72 max-h-96 z-[1000] bg-white/95 backdrop-blur-sm shadow-2xl border-0 animate-slide-in">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Active Users
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{activeUsers.length} users online</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="max-h-80">
          <div className="p-4 space-y-4">
            {/* Active Users Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="text-sm font-semibold text-slate-700">Currently Active</h4>
                <Badge variant="secondary" className="text-xs">
                  {activeUsers.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {activeUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-slate-900">
                            {user.name}
                            {user.name === currentUser?.full_name && (
                              <span className="text-xs text-green-600 ml-1">(You)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-green-600">
                          <Circle className="w-2 h-2 fill-current" />
                          <span>Drawing active</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border-2 border-white shadow-sm"
                        style={{ backgroundColor: user.color }}
                        title="User color indicator"
                      />
                    </div>
                  </div>
                ))}
                
                {activeUsers.length === 0 && (
                  <div className="text-center py-4 text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm">No users currently active</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recently Active Users */}
            {inactiveUsers.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <h4 className="text-sm font-semibold text-slate-700">Recently Active</h4>
                </div>
                
                <div className="space-y-2">
                  {inactiveUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium opacity-60"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm text-slate-600">{user.name}</p>
                      </div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Color Legend */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Palette className="w-3 h-3" />
                <span>Each user has a unique color for their drawings</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}