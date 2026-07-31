import api from "./api";

export interface UploadResumeResponse {
  statusCode?: number;
  success: boolean;
  message?: string;
  data?: {
    userId: string;
    fileName: string;
  };
}

export interface UploadJdResponse {
  statusCode?: number;
  success: boolean;
  message?: string;
  data?: {
    userId: string;
    jd?: any;
    jd_text?: string;
  };
}

export interface UploadGithubUsernameResponse {
  statusCode?: number;
  success: boolean;
  message?: string;
  data?: {
    userId: string;
    githubRepos?: any;
    username?: string;
  };
}

// Retain legacy interface name for backwards compatibility
export type UploadgithubUsername = UploadGithubUsernameResponse;

/**
 * Sends a PDF resume file to the backend parsing endpoint (`/api/resume/uploadresume`).
 *
 * @param resumeFile - The PDF resume file object to upload
 * @param token - Optional Clerk session token for authentication (`Authorization: Bearer <token>`)
 */
export async function parseResume(
  resumeFile: File,
  token?: string | null
): Promise<UploadResumeResponse> {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await api.post<UploadResumeResponse>(
    "/api/resume/uploadresume",
    formData,
    { headers }
  );

  return response.data;
}

/**
 * Sends job description text to the backend parsing endpoint (`/api/jd/parsejd`).
 *
 * @param jdText - Job description text string to upload
 * @param token - Optional Clerk session token for authentication
 */
export async function uploadJD(
  jdText: string,
  token?: string | null
): Promise<UploadJdResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await api.post<UploadJdResponse>(
    "/api/jd/parsejd",
    { jdText },
    { headers }
  );

  return response.data;
}

/**
 * Sends GitHub username to the backend scraping endpoint (`/api/github/githubdata`).
 *
 * @param githubUserId - GitHub username string to parse
 * @param token - Optional Clerk session token for authentication
 */
export async function uploadGithubUsername(
  githubUserId: string,
  token?: string | null
): Promise<UploadGithubUsernameResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await api.post<UploadGithubUsernameResponse>(
    "/api/github/githubdata",
    { githubUserId },
    { headers }
  );

  return response.data;
}

export default parseResume;