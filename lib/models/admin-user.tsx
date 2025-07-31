import Database from "@/lib/database"; // adjust import if needed

export async function getAdminUserByEmail(email: string) {
  const rows = await Database.query(
    "SELECT * FROM admin_users WHERE email = ? AND is_active = 1",
    [email]
  );
  return rows[0];
}