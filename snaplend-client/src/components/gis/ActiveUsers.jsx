import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { X, Users, Circle, Clock, Palette } from "lucide-react";
import { assignPastelColorsToUsers } from "../../utiles/randomColors";
import { WebSocketContext } from "../../contexts/WebSocketContext";

export default function ActiveUsers({ currentUser, onClose, onSelectedUser }) {
  const { activeUsers } = useContext(WebSocketContext);

  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // Convert object to array and assign colors
  const coloredUsers = assignPastelColorsToUsers(Object.values(activeUsers || {}));

  // Split into active and inactive users
  const activeColoredUsers = coloredUsers.filter(user =>
    user.isActive && user.displayName !== currentUser.displayName
  );
  const inactiveUsers = coloredUsers.filter(user => !user.isActive);

  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);
    if (onSelectedUser) onSelectedUser(user);
  };

  return (
    <Card className="absolute right-4 top-32 w-72 max-h-[80vh] z-[1000] bg-white/95 backdrop-blur-sm shadow-2xl border-0 animate-slide-in">
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
          <span>{activeColoredUsers.length} users online</span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea style={{ maxHeight: 'calc(100vh - 220px)' }}>
          <div className="p-4 space-y-4">

            {/* Active Users Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="text-sm font-semibold text-slate-700">Currently Active</h4>
                <Badge variant="secondary" className="text-xs">
                  {activeColoredUsers.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {activeColoredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={()=> handleSelectUser(user)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border
                      ${user.id === selectedUserId
                        ? "bg-blue-100 border-blue-300 ring-2 ring-blue-400"
                        : "bg-slate-50 border-transparent"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-slate-900">
                            {user.displayName}
                            {user.displayName === currentUser?.full_name && (
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

                {activeColoredUsers.length === 0 && (
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
                      onClick={()=> handleSelectUser(user)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border
                        ${user.id === selectedUserId
                          ? "bg-blue-100 border-blue-300 ring-2 ring-blue-400"
                          : "bg-slate-50 border-transparent"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium opacity-60"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm text-slate-600">{user.displayName}</p>
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
