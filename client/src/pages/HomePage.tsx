import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

interface HealthResponse {
  status: string;
  message: string;
}

function HomePage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await apiClient.get("/health");
      return res.data;
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      {/* ── Logo / Branding ── */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <span className="text-5xl">🍳</span>
        <h1 className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Night Code Kitchen
        </h1>
        <p className="text-sm text-slate-400">Akıllı Yemek Tarifi Uygulaması</p>
      </div>

      {/* ── Health Card ── */}
      <div className="w-full max-w-md rounded-2xl border border-surface-lighter bg-surface-light/60 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-brand-500/10 hover:shadow-2xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-200">
          🔗 API Bağlantı Durumu
        </h2>

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
            Bağlantı kontrol ediliyor…
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <p className="font-medium">❌ Bağlantı Hatası</p>
            <p className="mt-1 text-xs text-red-400">
              {(error as Error)?.message || "Sunucuya ulaşılamıyor"}
            </p>
          </div>
        )}

        {data && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <p className="font-medium">✅ API Bağlı</p>
            <pre className="mt-2 overflow-auto rounded bg-surface/60 p-3 text-xs text-slate-300">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <p className="mt-10 text-xs text-slate-600">
        Night Code Kitchen &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}

export default HomePage;
