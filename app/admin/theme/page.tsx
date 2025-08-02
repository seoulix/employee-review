"use client";

import type React from "react";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import {
  Palette,
  Upload,
  Save,
  Eye,
  Code,
  Download,
  Loader2,
  ImageIcon,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ThemeSettings {
  id?: number;
  app_name: string;
  logo_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  sidebar_color: string;
  header_color: string;
  custom_css: string;
  dark_mode_enabled: boolean;
  default_theme: "light" | "dark" | "system";
  font_family: string;
  font_size: string;
  border_radius: string;
  shadow_intensity: string;
}

const colorPresets = [
  { name: "Blue", primary: "#3b82f6", secondary: "#1e40af", accent: "#60a5fa" },
  {
    name: "Green",
    primary: "#10b981",
    secondary: "#047857",
    accent: "#34d399",
  },
  {
    name: "Purple",
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#a78bfa",
  },
  { name: "Red", primary: "#ef4444", secondary: "#dc2626", accent: "#f87171" },
  {
    name: "Orange",
    primary: "#f97316",
    secondary: "#ea580c",
    accent: "#fb923c",
  },
  { name: "Pink", primary: "#ec4899", secondary: "#db2777", accent: "#f472b6" },
];

    const fontOptions = [
      { name: "Inter", value: "Inter, sans-serif" },
      { name: "Roboto", value: "Roboto, sans-serif" },
      { name: "Open Sans", value: "Open Sans, sans-serif" },
      { name: "Lato", value: "Lato, sans-serif" },
      { name: "Poppins", value: "Poppins, sans-serif" },
      { name: "Montserrat", value: "Montserrat, sans-serif" },
      { name: "Bebas Neue", value: "Bebas Neue, sans-serif" },
      { name: "Caveat", value: "Caveat, cursive" },
      { name: "Merriweather", value: "Merriweather, serif" },
      { name: "Orbitron", value: "Orbitron, sans-serif" },
      { name: "Playfair Display", value: "Playfair Display, serif" },
      { name: "Space Mono", value: "Space Mono, monospace" },
    ];

export default function ThemeCustomizationPage() {
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    app_name: "Employee Review System",
    primary_color: "#3b82f6",
    secondary_color: "#1e40af",
    accent_color: "#60a5fa",
    background_color: "#ffffff",
    text_color: "#1f2937",
    sidebar_color: "#f8fafc",
    header_color: "#ffffff",
    custom_css: "",
    dark_mode_enabled: true,
    default_theme: "system",
    font_family: "Inter, sans-serif",
    font_size: "14px",
    border_radius: "6px",
    shadow_intensity: "medium",
  });

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/theme");
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setThemeSettings({ ...themeSettings, ...data.settings });
        }
      }
    } catch (error) {
      console.error("Error loading theme settings:", error);
      toast({
        title: "Error",
        description: "Failed to load theme settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveThemeSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(themeSettings),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Theme settings saved successfully",
        });
        // Apply theme changes immediately
        applyThemeChanges();
        // Apply default theme immediately
        if (themeSettings.default_theme) {
          if (themeSettings.default_theme === 'light' || themeSettings.default_theme === 'dark' || themeSettings.default_theme === 'system') {
            setTheme(themeSettings.default_theme);
            console.log('Theme applied immediately:', themeSettings.default_theme);
          }
        }
        // Trigger theme data refresh in admin layout
        // Dispatch a custom event to notify admin layout to refresh theme
        window.dispatchEvent(new CustomEvent('themeSettingsUpdated'));
      } else {
        throw new Error("Failed to save theme settings");
      }
    } catch (error) {
      console.error("Error saving theme settings:", error);
      toast({
        title: "Error",
        description: "Failed to save theme settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const applyThemeChanges = () => {
    const root = document.documentElement;
    root.style.setProperty("--primary", themeSettings.primary_color);
    root.style.setProperty("--secondary-color", themeSettings.secondary_color);
    root.style.setProperty("--accent-color", themeSettings.accent_color);
    root.style.setProperty(
      "--background-color",
      themeSettings.background_color
    );
    root.style.setProperty("--text-color", themeSettings.text_color);
    root.style.setProperty("--font-family", themeSettings.font_family);
    root.style.setProperty("--font-size", themeSettings.font_size);
    root.style.setProperty("--border-radius", themeSettings.border_radius);
    root.style.setProperty("--header-color", themeSettings.header_color);

    // Apply custom CSS
    let customStyleElement = document.getElementById("custom-theme-styles");
    if (!customStyleElement) {
      customStyleElement = document.createElement("style");
      customStyleElement.id = "custom-theme-styles";
      document.head.appendChild(customStyleElement);
    }
    customStyleElement.textContent = themeSettings.custom_css;
  };

  const uploadFile = async (file: File, type: "logo" | "favicon") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/theme/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (type === "logo") {
          setThemeSettings({ ...themeSettings, logo_url: data.url });
        } else {
          setThemeSettings({ ...themeSettings, favicon_url: data.url });
        }
        toast({
          title: "Success",
          description: `${
            type === "logo" ? "Logo" : "Favicon"
          } uploaded successfully`,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: `Failed to upload ${type}`,
        variant: "destructive",
      });
    }
  };

  const exportTheme = () => {
    const themeData = {
      ...themeSettings,
      exported_at: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        setThemeSettings({ ...themeSettings, ...themeData });
        toast({
          title: "Success",
          description: "Theme imported successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Invalid theme file",
        });
      }
    };
    reader.readAsText(file);
  };

  const applyColorPreset = (preset: (typeof colorPresets)[0]) => {
    setThemeSettings({
      ...themeSettings,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6  ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Theme & UI Customization
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Customize the look and feel of your admin dashboard
            </p>
          </div>
          <div className="flex gap-2">
            {/* <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {previewMode ? "Exit Preview" : "Preview"}
            </Button> */}
            <Button  style={{borderRadius: "var(--border-radius)"}}
              onClick={saveThemeSettings}
              disabled={saving}
              className=" bg-white dark:bg-black"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Theme
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList className="w-full flex justify-between">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            {/* <TabsTrigger value="layout">Layout</TabsTrigger> */}
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-6">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Brand Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="app_name">Application Name</Label>
                  <Input
                    id="app_name"
                    value={themeSettings.app_name}
                    onChange={(e) =>
                      setThemeSettings({
                        ...themeSettings,
                        app_name: e.target.value,
                      })
                    }
                    placeholder="Enter application name"
                  />
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Logo Upload</Label>
                    <div className="mt-2 space-y-4">
                      {themeSettings.logo_url && (
                        <div className="p-4 border rounded-lg">
                          <img
                            src={themeSettings.logo_url || "/placeholder.svg"}
                            alt="Logo"
                            className="h-12 object-contain"
                          />
                        </div>
                      )}
                  <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </label>
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) uploadFile(file, "logo")
                          }}
                        />
                      </div> 
                      <p className="text-sm text-gray-500">Recommended: 200x50px, PNG or SVG</p>
                    </div>
                  </div>

                  <div>
                    <Label>Favicon Upload</Label>
                    <div className="mt-2 space-y-4">
                      {themeSettings.favicon_url && (
                        <div className="p-4 border rounded-lg">
                          <img
                            src={themeSettings.favicon_url || "/placeholder.svg"}
                            alt="Favicon"
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="favicon-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Favicon
                          </label>
                        </Button>
                        <input
                          id="favicon-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) uploadFile(file, "favicon")
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-500">Recommended: 32x32px, ICO or PNG</p>
                    </div>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Mode Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color Presets */}
                {/* <div>
                  <Label className="text-base">Color Presets</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyColorPreset(preset)}
                        className="p-3 border rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <div className="flex gap-1 mb-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.secondary }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.accent }}
                          />
                        </div>
                        <div className="text-xs font-medium">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div> */}

                {/* Custom Colors
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="primary_color"
                        type="color"
                        value={themeSettings.primary_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            primary_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={themeSettings.primary_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            primary_color: e.target.value,
                          })
                        }
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={themeSettings.secondary_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            secondary_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={themeSettings.secondary_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            secondary_color: e.target.value,
                          })
                        }
                        placeholder="#1e40af"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="accent_color"
                        type="color"
                        value={themeSettings.accent_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            accent_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={themeSettings.accent_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            accent_color: e.target.value,
                          })
                        }
                        placeholder="#60a5fa"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="background_color">Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="background_color"
                        type="color"
                        value={themeSettings.background_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            background_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={themeSettings.background_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            background_color: e.target.value,
                          })
                        }
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div> */}

                {/* Theme Mode Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Dark Mode Support</Label>
                      <div className="text-sm text-gray-500">
                        Enable dark mode toggle for users
                      </div>
                    </div>
                    <Switch
                      checked={themeSettings.dark_mode_enabled}
                      onCheckedChange={(checked) =>
                        setThemeSettings({
                          ...themeSettings,
                          dark_mode_enabled: checked,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Default Theme</Label>
                    <div className="flex gap-2 mt-2">
                      {[
                        { value: "light", icon: Sun, label: "Light" },
                        { value: "dark", icon: Moon, label: "Dark" },
                        { value: "system", icon: Monitor, label: "System" },
                      ].map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => {
                            setThemeSettings({
                              ...themeSettings,
                              default_theme: value as any,
                            });
                            // Apply theme immediately
                            if (value === 'light' || value === 'dark' || value === 'system') {
                              setTheme(value);
                              console.log('Theme applied immediately:', value);
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                            themeSettings.default_theme === value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "hover:border-gray-400"
                          }`}
                          style={{borderRadius: "var(--border-radius)"}}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle>Typography Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Font Family</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {fontOptions.map((font) => (
                      <button
                        key={font.value}
                        onClick={() =>
                          setThemeSettings({
                            ...themeSettings,
                            font_family: font.value,
                          })
                        }
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          themeSettings.font_family === font.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "hover:border-gray-400"
                        }`}
                        style={{ fontFamily:`${font.value.split(",")[0]}`,borderRadius: "var(--border-radius)"}}
                      >
                        <div className="font-medium" style={{ fontFamily:`${font.value.split(",")[0]}`}}>
                          {font.name}
                        </div>
                        <div className="text-sm text-gray-500"                         style={{ fontFamily:`${font.value.split(",")[0]}`}}>
                          The quick brown fox { `fontFamily:${font.value.split(",")[0]} sans-serif`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="font_size">Base Font Size</Label>
                    <Input
                      id="font_size"
                      value={themeSettings.font_size}
                      onChange={(e) =>
                        setThemeSettings({
                          ...themeSettings,
                          font_size: e.target.value,
                        })
                      }
                      placeholder="14px"
                    />
                  </div>

                  <div>
                    <Label htmlFor="border_radius">Border Radius</Label>
                    <Input
                      id="border_radius"
                      value={themeSettings.border_radius}
                      onChange={(e) =>
                        setThemeSettings({
                          ...themeSettings,
                          border_radius: e.target.value,
                        })
                      }
                      placeholder="6px"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="layout" className="space-y-6">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle>Layout Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sidebar_color">Sidebar Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="sidebar_color"
                        type="color"
                        value={themeSettings.sidebar_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            sidebar_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={themeSettings.sidebar_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            sidebar_color: e.target.value,
                          })
                        }
                        placeholder="#f8fafc"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="header_color">Header Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="header_color"
                        type="color"
                        value={themeSettings.header_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            header_color: e.target.value,
                          })
                        }
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={themeSettings.header_color}
                        onChange={(e) =>
                          setThemeSettings({
                            ...themeSettings,
                            header_color: e.target.value,
                          })
                        }
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Shadow Intensity</Label>
                  <div className="flex gap-2 mt-2">
                    {["none", "light", "medium", "heavy"].map((intensity) => (
                      <button
                        key={intensity}
                        onClick={() =>
                          setThemeSettings({
                            ...themeSettings,
                            shadow_intensity: intensity,
                          })
                        }
                        className={`px-4 py-2 border rounded-lg transition-colors capitalize ${
                          themeSettings.shadow_intensity === intensity
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "hover:border-gray-400"
                        }`}
                        style={{borderRadius: "var(--border-radius)"}}
                      >
                        {intensity}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          <TabsContent value="advanced" className="space-y-6">
            <Card  style={{borderRadius: "var(--border-radius)"}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Advanced Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="custom_css">Custom CSS</Label>
                  <Textarea
                    id="custom_css"
                    value={themeSettings.custom_css}
                    onChange={(e) =>
                      setThemeSettings({
                        ...themeSettings,
                        custom_css: e.target.value,
                      })
                    }
                    placeholder="/* Add your custom CSS here */
.custom-button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  color: white;
}

.feedback-form {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}"
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Add custom CSS to override default styles. Changes will be
                    applied immediately.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={exportTheme}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Theme
                  </Button>

                  <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" asChild>
                    <label htmlFor="import-theme" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Theme
                    </label>
                  </Button>
                  <input
                    id="import-theme"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={importTheme}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
