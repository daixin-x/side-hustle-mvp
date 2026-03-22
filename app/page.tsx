"use client";

import { useMemo, useState } from "react";

type ResultSection = {
  title: string;
  content: string[];
};

function parseResultSections(raw: string): ResultSection[] {
  const normalized = raw.replace(/\r/g, "").trim();
  if (!normalized) return [];

  const lines = normalized.split("\n");
  const sections: ResultSection[] = [];
  let current: ResultSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^【(.+?)】\s*(.*)$/);

    if (headingMatch) {
      if (current) sections.push(current);
      current = {
        title: headingMatch[1],
        content: headingMatch[2] ? [headingMatch[2]] : [],
      };
      continue;
    }

    if (!current) {
      current = {
        title: "综合建议",
        content: [trimmed],
      };
      continue;
    }

    current.content.push(trimmed);
  }

  if (current) sections.push(current);
  return sections;
}

const quickPrompts = [
  {
    title: "上班族晚间副业",
    text: "我是上班族，每天晚上 2 小时，会一点文案和表格，想合法合规多赚 1000-3000 元。",
  },
  {
    title: "宝妈碎片时间",
    text: "我是宝妈，白天有碎片时间，预算不高，想做能长期积累、最好可在家完成的副业。",
  },
  {
    title: "大学生低门槛尝试",
    text: "我是大学生，周末时间多，想做低门槛、线上开始、前期投入低的兼职。",
  },
];

const highlights = [
  { label: "更容易开始", desc: "示例输入 + 引导文案，减少空白感。" },
  { label: "结果更好读", desc: "更强层级、卡片容器、舒适留白。" },
  { label: "体验更像产品", desc: "状态反馈、复制、加载骨架屏、沉浸式视觉。" },
];

const steps = [
  "写下你的时间、技能、预算和目标",
  "点击生成，系统整理成现实可执行方案",
  "复制结果，继续优化或执行",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const canCopy = useMemo(() => result.trim().length > 0, [result]);
  const inputLength = input.trim().length;
  const parsedSections = useMemo(() => parseResultSections(result), [result]);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("先写一点你的情况，比如时间、技能、预算和目标。写得越具体，结果越贴近你。");
      setResult("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");
      setCopied(false);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "生成失败，请稍后再试。");
        return;
      }

      if (data.result) {
        setResult(data.result);
      } else {
        setError("接口返回异常，请检查后端返回格式。");
      }
    } catch {
      setError("请求失败，请检查网络或接口配置。");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!canCopy) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      alert("复制失败，请手动复制");
    }
  };

  const applyQuickPrompt = (text: string) => {
    setInput(text);
    setError("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_85%_15%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(to_bottom,#020617,#0f172a,#111827)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 lg:px-12">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-sky-200 backdrop-blur">
            AI 副业规划工具
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            体验优先版本
          </span>
          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-200">
            更强 UI + 更丰富内容
          </span>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-sky-300/90">
              Side Hustle Experience
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl md:leading-[1.05]">
              让用户一进来就觉得
              <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
                好用、清晰、愿意继续探索
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              这版先不强调变现，而是把体验做厚：更明确的输入引导、更舒服的阅读区域、更强的产品感，以及让第一次使用也不会迷路的界面节奏。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 shadow-lg shadow-black/10 backdrop-blur"
              >
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] shadow-2xl shadow-slate-950/40 backdrop-blur-2xl">
            <div className="border-b border-white/10 px-6 py-6 md:px-8 md:py-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-300/90">
                    输入区
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                    告诉系统你的现实情况
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                  <p className="text-xs text-slate-400">当前输入字数</p>
                  <p className="mt-1 text-lg font-semibold text-white">{inputLength}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-8">
              <div className="grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/15 text-sm font-semibold text-sky-200">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-slate-200">描述你的情况</label>
                  <span className="text-xs text-slate-400">越具体，结果越贴近你</span>
                </div>

                <textarea
                  placeholder="例如：我是上班族，每天晚上 2 小时，会一点文案和表格，不想违法违规，想月入 1000-3000。也可以写你的预算、资源、能接受的风险。"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[220px] w-full rounded-[24px] border border-white/10 bg-slate-950/75 px-5 py-4 text-base leading-7 text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400/60 focus:ring-4 focus:ring-sky-400/10"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <span>建议至少写出：时间、技能、目标、预算、风险偏好</span>
                  <span>{inputLength < 20 ? "建议再详细一点" : "信息量不错，可以开始生成"}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-300">快速示例</p>
                  <p className="text-xs text-slate-500">点一下即可填入</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.title}
                      onClick={() => applyQuickPrompt(prompt.text)}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-sky-400/40 hover:bg-sky-400/10"
                    >
                      <p className="text-sm font-semibold text-white">{prompt.title}</p>
                      <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-400">{prompt.text}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {loading ? "正在生成方案..." : "生成副业方案"}
                </button>

                <button
                  onClick={handleCopy}
                  disabled={!canCopy}
                  className="inline-flex items-center rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {copied ? "已复制" : "复制结果"}
                </button>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                  当前目标：让第一次使用也感觉顺滑
                </span>
              </div>

              {error ? (
                <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
                  {error}
                </div>
              ) : null}
            </div>
          </section>

          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/75 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl">
            <div className="border-b border-white/10 px-6 py-5 md:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300/90">
                    输出预览
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                    结果区
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-medium text-emerald-200">
                    可复制
                  </span>
                  <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 font-medium text-sky-200">
                    更舒适阅读
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-7">
              {loading ? (
                <div className="space-y-4">
                  <SkeletonBlock className="h-6 w-36" />
                  <SkeletonBlock className="h-5 w-full" />
                  <SkeletonBlock className="h-5 w-[94%]" />
                  <SkeletonBlock className="h-5 w-[91%]" />
                  <div className="pt-3" />
                  <SkeletonBlock className="h-6 w-40" />
                  <SkeletonBlock className="h-5 w-full" />
                  <SkeletonBlock className="h-5 w-[88%]" />
                  <SkeletonBlock className="h-5 w-[84%]" />
                  <div className="pt-3" />
                  <SkeletonBlock className="h-24 w-full" />
                </div>
              ) : result ? (
  <div className="space-y-4">
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        结果概览
      </p>
      <p className="mt-2 text-sm leading-7 text-slate-300">
        这份建议已经按模块拆开，你可以更快浏览重点，也更适合复制、对比和后续继续优化。
      </p>
    </div>

    <div className="grid gap-4">
      {parsedSections.length > 0 ? (
        parsedSections.map((section) => (
          <section
            key={section.title}
            className="rounded-[24px] border border-white/10 bg-black/20 p-5 shadow-lg shadow-black/10"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white md:text-lg">
                {section.title}
              </h3>
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-medium text-sky-200">
                {section.content.length} 条内容
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {section.content.map((item, index) => {
                const isList = /^[-*•]|^\d+[.、]/.test(item);

                return (
                  <div
                    key={`${section.title}-${index}`}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-slate-200">
                        {isList ? index + 1 : "·"}
                      </div>
                      <p className="text-sm leading-7 text-slate-200">
                        {item
                          .replace(/^[-*•]\s*/, "")
                          .replace(/^\d+[.、]\s*/, "")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      ) : (
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 shadow-lg shadow-black/10">
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-8 text-slate-100 md:text-[15px]">
            {result}
          </pre>
        </div>
      )}
    </div>
  </div>
              ) : (
                <div className="flex min-h-[520px] flex-col justify-between rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-6">
                  <div>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                      ✨
                    </div>
                    <h3 className="text-xl font-semibold text-white">结果会显示在这里</h3>
                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                      先在左侧写下你的时间、技能、预算和目标，再点击生成。当前版本重点是提升第一眼体验和整体使用感。
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <MiniPanel title="你会得到什么" desc="更清晰的推荐方向、执行步骤、收益预估和风险提醒。" />
                    <MiniPanel title="为什么这样设计" desc="让用户第一次使用时，就能快速理解、快速行动。" />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />;
}

function MiniPanel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
    </div>
  );
}