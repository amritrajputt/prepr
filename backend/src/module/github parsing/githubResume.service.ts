import axios from "axios";
import { eq } from "drizzle-orm";
import { db } from "../../index.js";
import { githubMetadataTable } from "../../DB/schema.js";
import { ensureUserExists } from "../../common/utils/ensureUser.js";

interface GithubMetadata {
  name: string;
  description: string | null;
}

export class GithubScrapeService {
  static async getGithubData(userId: string, githubUserId: string): Promise<GithubMetadata[]> {
    await ensureUserExists(userId);

    const baseUrl = `https://api.github.com/users/${githubUserId}/repos?sort=updated&direction=desc&per_page=5`;
    const response = await axios.get(baseUrl, {
      headers: {
        "User-Agent": "Prepr-AI-App",
      },
    });
    const data = response.data;

    if (!data || data.length === 0) {
      throw new Error("No repositories found for this GitHub user");
    }

    const githubRepos: GithubMetadata[] = data.map((repo: any) => ({
      name: repo.name,
      description: repo.description || null,
    }));
    console.log("Scraped GitHub Repos:", githubRepos);

    const existing = await db
      .select()
      .from(githubMetadataTable)
      .where(eq(githubMetadataTable.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(githubMetadataTable)
        .set({
          data: JSON.stringify(githubRepos),
          createdAt: new Date(),
        })
        .where(eq(githubMetadataTable.userId, userId));
    } else {
      await db
        .insert(githubMetadataTable)
        .values({ userId, data: JSON.stringify(githubRepos) });
    }

    return githubRepos;
  }
}