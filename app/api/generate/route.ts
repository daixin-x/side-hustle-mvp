import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userInput = body.input || "";

    const apiKey = "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";

    const prompt = `
你是一个合法合规的副业顾问。
请根据用户输入，生成一份现实、具体、保守、不夸大的副业建议。

用户输入：
${userInput}

请按下面格式输出：

【推荐方向】
...

【为什么适合】
...

【怎么开始】
1. ...
2. ...
3. ...

【收益预估】
...

【风险提醒】
...
`.trim();

    console.log("key前缀:", apiKey.slice(0, 12));
    console.log("key长度:", apiKey.length);

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "side-hustle-mvp",
    };

    console.log("Authorization预览:", headers.Authorization.slice(0, 20));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenRouter状态码:", response.status);
    console.log("OpenRouter返回:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || `请求失败，状态码 ${response.status}` },
        { status: response.status }
      );
    }

    const result =
      data?.choices?.[0]?.message?.content || "模型没有返回内容";

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("生成失败：", error);
    return NextResponse.json(
      { error: error?.message || "服务器内部错误" },
      { status: 500 }
    );
  }
}