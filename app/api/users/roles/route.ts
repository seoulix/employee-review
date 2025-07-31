import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Since there's no roles table, return hardcoded roles from the ENUM
    const roles = [
      {
        id: "super_admin",
        name: "super_admin",
        display_name: "Super Administrator",
        permissions: [
          "dashboard.view",
          "brands.view", "brands.create", "brands.edit", "brands.delete",
          "outlets.view", "outlets.create", "outlets.edit", "outlets.delete",
          "employees.view", "employees.create", "employees.edit", "employees.delete",
          "feedback.view", "feedback.create", "feedback.edit", "feedback.delete",
          "reports.view", "reports.export",
          "settings.view", "settings.edit",
          "users.view", "users.create", "users.edit", "users.delete"
        ]
      },
      {
        id: "admin",
        name: "admin", 
        display_name: "Administrator",
        permissions: [
          "dashboard.view",
          "brands.view", "brands.create", "brands.edit", "brands.delete",
          "outlets.view", "outlets.create", "outlets.edit", "outlets.delete",
          "employees.view", "employees.create", "employees.edit", "employees.delete",
          "feedback.view", "feedback.create", "feedback.edit", "feedback.delete",
          "reports.view", "reports.export",
          "settings.view", "settings.edit"
        ]
      },
      {
        id: "manager",
        name: "manager",
        display_name: "Manager", 
        permissions: [
          "dashboard.view",
          "brands.view",
          "outlets.view",
          "employees.view",
          "feedback.view",
          "reports.view", "reports.export"
        ]
      }
    ];

    return NextResponse.json({ success: true, roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch roles" }, { status: 500 });
  }
} 