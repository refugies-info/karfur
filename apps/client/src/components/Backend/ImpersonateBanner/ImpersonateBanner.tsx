import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userDetailsSelector } from "~/services/User/user.selectors";
import { setAuthToken } from "~/utils/authToken";

const IMPERSONATE_COOKIE = "impersonation-admin-token";

export const ImpersonateBanner = () => {
  // Lire le cookie uniquement côté client pour éviter l'erreur d'hydratation SSR
  const [adminToken, setAdminToken] = useState<string | undefined>(undefined);
  const currentUser = useSelector(userDetailsSelector);

  useEffect(() => {
    setAdminToken(Cookies.get(IMPERSONATE_COOKIE));
  }, []);

  if (!adminToken) return null;

  const handleReturnToAdmin = () => {
    setAuthToken(adminToken);
    Cookies.remove(IMPERSONATE_COOKIE);
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#b34000",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      <span>
        👤 Mode impersonation — Vous consultez le compte de{" "}
        <strong>{currentUser?.username || currentUser?.email || "..."}</strong>
      </span>
      <button
        onClick={handleReturnToAdmin}
        style={{
          backgroundColor: "#fff",
          color: "#b34000",
          border: "none",
          borderRadius: "4px",
          padding: "6px 14px",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "13px",
        }}
      >
        ↩ Reprendre mon compte admin
      </button>
    </div>
  );
};
