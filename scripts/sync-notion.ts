// scripts/sync-notion.ts
import { Client } from "@notionhq/client";
import * as core from "@actions/core";
import * as github from "@actions/github";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function run() {
  try {
    const dbId = process.env.NOTION_DATABASE_ID!;
    const propId = "ID";
    const propStatus = "상태";
    const propPR = "GitHub Pull Requests";

    // 데이터베이스 정보 받아오기 (속성 타입 포함)
    const dbInfo = await notion.databases.retrieve({ database_id: dbId });
    console.log("Database properties info:", JSON.stringify(dbInfo.properties, null, 2));


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
