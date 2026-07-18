import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { statsApi } from "../lib/api";
import type { DashboardStats } from "../types";
import { formatNumber, formatDuration } from "../lib/constants";
import {
  Activity,
  Radio,
  Key,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Sparkle,
  ShieldCheck,
  Workflow,
  Plus,
  ArrowRight,
  Settings,
  BookOpen,
  LayoutPanelTop,
} from "lucide-react";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    statsApi.getDashboard().then(setStats).catch(() => {});
    const interval = setInterval(() => statsApi.getDashboard().then(setStats).catch(() => {}), 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <div className="page-shell text-sm text-muted-foreground">加载中...</div>;
  }

  const cards = [
    { label: "今日请求", value: formatNumber(stats.today_requests), icon: Activity, color: "text-slate-300" },
    { label: "今日 Token", value: formatNumber(stats.today_total_tokens), icon: Zap, color: "text-stone-300" },
    { label: "活跃渠道", value: `${stats.active_channels}/${stats.total_channels}`, icon: Radio, color: "text-emerald-300" },
    { label: "密钥数量", value: stats.total_api_keys.toString(), icon: Key, color: "text-slate-400" },
  ];

  const quickActions = [
    {
      title: "新建渠道",
      desc: "接入新的上游模型服务商",
      icon: Plus,
      action: () => navigate("/channels"),
    },
    {
      title: "管理密钥",
      desc: "快速配置下游访问凭证",
      icon: Key,
      action: () => navigate("/api-keys"),
    },
    {
      title: "查看接入示例",
      desc: "复制 SDK / cURL 使用方式",
      icon: BookOpen,
      action: () => navigate("/usage"),
    },
    {
      title: "调整设置",
      desc: "修改服务监听与重试策略",
      icon: Settings,
      action: () => navigate("/settings"),
    },
  ];

  const consoleItems = [
    {
      label: "服务吞吐",
      value: formatNumber(stats.total_requests),
      hint: "累计请求总量",
    },
    {
      label: "模型消耗",
      value: formatNumber(stats.total_tokens),
      hint: "累计 Token 使用量",
    },
    {
      label: "当前健康度",
      value: stats.total_channels > 0 ? `${Math.round((stats.active_channels / stats.total_channels) * 100)}%` : "0%",
      hint: "按启用渠道占比估算",
    },
  ];

  return (
    <div className="page-shell space-y-6">
      <section className="surface rounded-[24px] p-6 md:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkle className="h-3.5 w-3.5" /> 控制台首页
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">欢迎使用 xapi</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-[15px]">
              在一个统一入口中管理上游模型渠道、下游密钥、请求统计与故障切换，让本地 LLM 网关更稳定、更清晰、更易运维。
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="surface-soft rounded-full px-3 py-2">多渠道接入</span>
              <span className="surface-soft rounded-full px-3 py-2">优先级调度</span>
              <span className="surface-soft rounded-full px-3 py-2">失败切换</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:w-[460px]">
            <div className="surface-soft rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-emerald-300" /> 服务可用率</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {stats.total_channels > 0 ? `${Math.round((stats.active_channels / stats.total_channels) * 100)}%` : "0%"}
              </div>
            </div>
            <div className="surface-soft rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Workflow className="h-4 w-4 text-slate-300" /> 平均延迟</div>
              <div className="mt-2 text-2xl font-semibold text-white">{formatDuration(Math.round(stats.avg_latency_ms))}</div>
            </div>
            <div className="surface-soft rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="h-4 w-4 text-slate-300" /> 累计请求</div>
              <div className="mt-2 text-2xl font-semibold text-white">{formatNumber(stats.total_requests)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface rounded-[20px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">快速操作</h2>
              <p className="mt-1 text-sm text-muted-foreground">把常用操作放到首页，减少跳转成本</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
              <LayoutPanelTop className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {quickActions.map(({ title, desc, icon: Icon, action }) => (
              <button
                key={title}
                onClick={action}
                className="surface-soft group rounded-2xl p-4 text-left transition-all hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/6 bg-white/[0.03]">
                      <Icon className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                    <div className="mt-4 text-sm font-medium text-white">{title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="surface rounded-[20px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">控制台摘要</h2>
              <p className="mt-1 text-sm text-muted-foreground">聚焦当前系统规模、消耗与健康水平</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
              <Sparkle className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {consoleItems.map((item) => (
              <div key={item.label} className="surface-soft rounded-2xl px-4 py-4">
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="surface data-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
              </div>
              <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="surface rounded-[20px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">运行摘要</h2>
              <p className="mt-1 text-sm text-muted-foreground">核心指标帮助快速判断当前系统健康度</p>
            </div>
            <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
              <Sparkle className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="surface-soft rounded-2xl p-4">
              <div className="text-sm text-muted-foreground">平均延迟</div>
              <div className="mt-2 text-2xl font-semibold">{formatDuration(Math.round(stats.avg_latency_ms))}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-300">
                <ArrowUpRight className="h-3.5 w-3.5" /> 响应性能稳定
              </div>
            </div>
            <div className="surface-soft rounded-2xl p-4">
              <div className="text-sm text-muted-foreground">总 Token</div>
              <div className="mt-2 text-2xl font-semibold">{formatNumber(stats.total_tokens)}</div>
              <div className="mt-2 text-xs text-muted-foreground">累计消耗量</div>
            </div>
            <div className="surface-soft rounded-2xl p-4">
              <div className="text-sm text-muted-foreground">可用渠道率</div>
              <div className="mt-2 text-2xl font-semibold">
                {stats.total_channels > 0 ? `${Math.round((stats.active_channels / stats.total_channels) * 100)}%` : "0%"}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">已启用 / 总渠道</div>
            </div>
          </div>
        </section>

        <section className="surface rounded-[20px] p-6">
          <h2 className="text-lg font-semibold">运维建议</h2>
          <div className="mt-5 space-y-3">
            <div className="surface-soft rounded-2xl p-4">
              <div className="text-sm font-medium">优先检查渠道健康度</div>
              <div className="mt-1 text-sm text-muted-foreground">若活跃渠道偏少，建议前往渠道页执行测试并及时启用备用线路。</div>
            </div>
            <div className="surface-soft rounded-2xl p-4">
              <div className="text-sm font-medium">关注 API Key 配额</div>
              <div className="mt-1 text-sm text-muted-foreground">当配额接近上限时，及时新增或调整下游密钥策略，避免服务中断。</div>
            </div>
            <div className="surface-soft rounded-2xl p-4">
              <div className="text-sm font-medium">结合日志定位异常</div>
              <div className="mt-1 text-sm text-muted-foreground">若平均延迟波动明显，可在日志页筛查失败请求与上游模型表现。</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
