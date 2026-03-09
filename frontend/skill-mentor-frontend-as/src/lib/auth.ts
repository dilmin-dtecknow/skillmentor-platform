export interface SkillMentorTokenPayload {
  roles?: string[];
  email?: string;
  first_name?: string;
  last_name?: string;
  sub?: string;
  aud?: string;
  [key: string]: unknown;
}

export function parseJwtPayload(token: string): SkillMentorTokenPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as SkillMentorTokenPayload;
  } catch (error) {
    console.error("Failed to parse JWT payload", error);
    return null;
  }
}

export async function getRoleFromToken(
  getToken: (options?: { template?: string }) => Promise<string | null>
): Promise<string | null> {
  const token = await getToken({ template: "skill-mentor" });
  if (!token) return null;

  const payload = parseJwtPayload(token);
  const roles = payload?.roles ?? [];

  if (roles.includes("ADMIN")) return "admin";
  return "student";
}

export async function isAdminFromToken(
  getToken: (options?: { template?: string }) => Promise<string | null>
): Promise<boolean> {
  const role = await getRoleFromToken(getToken);
  return role === "admin";
}