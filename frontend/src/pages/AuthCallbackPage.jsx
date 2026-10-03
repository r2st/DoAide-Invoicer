import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../lib/api";

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token) {
      setToken(token);
      window.location.href = "/";
    } else {
      navigate("/login", { replace: true });
    }
  }, [params, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-ink-muted">Signing you in…</p>
    </div>
  );
}
