// scripts/sync-notion.ts
import { Client } from "@notionhq/client";
import * as core from "@actions/core";
import * as github from "@actions/github";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function run() {
  try {
    const dbId = process.env.NOTION_DATABASE_ID!;
    const propId = process.env.NOTION_PROP_ID || "ID";
    const propStatus = process.env.NOTION_PROP_STATUS || "상태";
    const propPR = process.env.NOTION_PROP_PR || "GitHub Pull Requests";

    const { pull_request: pr } = github.context.payload as any;
    if (!pr) throw new Error("No pull request context available");

    const branch = pr.head.ref;
    const prUrl = pr.html_url;
    const prState = pr.merged ? "완료" : pr.state === "open" ? "진행 중" : "";

    const match = branch.match(/([A-Z]+-\d+)/);
    if (!match) throw new Error("No matching document ID in branch name");
    const documentId = match[1];

    // 🔍 Find the Notion page with the matching ID
    const searchResult = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: propId,
        rich_text: {
          equals: documentId,
        },
      },
    });

    if (searchResult.results.length === 0) {
      throw new Error(`No Notion page found with ID: ${documentId}`);
    }

    const pageId = searchResult.results[0].id;

    // 📝 Update the page
    const update: any = {
      properties: {
        [propPR]: {
          url: prUrl,
        },
      },
    };
    if (prState) {
      update.properties[propStatus] = {
        select: { name: prState },
      };
    }

    await notion.pages.update({ page_id: pageId, ...update });
    console.log(`✅ Notion page ${documentId} updated.`);
  } catch (err) {
    core.setFailed((err as Error).message);
  }
}

run();
