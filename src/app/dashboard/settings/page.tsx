"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Bell,
  Sun,
  Shield,
  BarChart,
  Camera,
  User,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Settings = () => {
  const { data: session } = useSession();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(session?.user?.image || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deleted");
    // Add actual account deletion logic here
  };

  return (
    <div className="max-w-8xl min-h-full w-full bg-gray-900 px-6 py-12 text-white">
      <div className="mb-6">
        <h1 className="mb-4 text-4xl font-extrabold">Settings</h1>
        <p className="text-gray-400">
          Manage your preferences and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Account Settings - 2 Columns */}
        <Card className="border-gray-800 bg-gray-800/50 text-white md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-700">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <Label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-gray-700 p-2 hover:bg-gray-600"
                >
                  <Camera className="h-4 w-4" />
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  type="text"
                  placeholder="Your full name"
                  defaultValue={session?.user?.name || ""}
                  className="mt-2 h-9 border-gray-700 bg-gray-800"
                />
              </div>
              <div>
                <Label className="text-sm">Email Address</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  defaultValue={session?.user?.email || ""}
                  className="mt-2 h-9 border-gray-700 bg-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings - 2 Columns */}
        <Card className="border-gray-800 bg-gray-800/50 text-white md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription className="text-gray-400">
              Update your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  className="mt-2 h-9 border-gray-700 bg-gray-800"
                />
              </div>
              <div>
                <Label className="text-sm">New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="mt-2 h-9 border-gray-700 bg-gray-800"
                />
              </div>
              <div>
                <Label className="text-sm">Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="mt-2 h-9 border-gray-700 bg-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Column - 2 Columns */}
        <div className="space-y-4 md:col-span-2">
          {/* Appearance Settings */}
          <Card className="border-gray-800 bg-gray-800/50 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm">Dark Mode</Label>
                  <p className="text-sm text-gray-400">Toggle theme</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-gray-800 bg-gray-800/50 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm">Email Updates</Label>
                  <p className="text-sm text-gray-400">Daily problems</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Settings */}
          <Card className="border-gray-800 bg-gray-800/50 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Easy</Label>
                  <Select defaultValue="3">
                    <SelectTrigger className="h-9 border-gray-700 bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Medium</Label>
                  <Select defaultValue="2">
                    <SelectTrigger className="h-9 border-gray-700 bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Hard</Label>
                  <Select defaultValue="1">
                    <SelectTrigger className="h-9 border-gray-700 bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-red-800 bg-transparent text-red-500 hover:bg-red-950 hover:text-red-400"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-gray-800 bg-gray-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-700 bg-transparent text-white hover:bg-gray-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="border-gray-700 bg-transparent text-white hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-gray-800 to-black font-semibold text-green-600 hover:from-black hover:to-gray-900 hover:text-green-400"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
