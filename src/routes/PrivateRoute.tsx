import { Navigate } from "react-router-dom";
import { useClient } from "@/context/ClientContext";
import { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { clientNumber } = useClient();

  console.log("[PrivateRoute] clientNumber:", clientNumber);

  // Enquanto o estado ainda está "carregando"
  if (clientNumber === null) {
    return <div className="text-white text-center p-4">Carregando...</div>;
  }

  // Se não houver número salvo, redireciona
  if (!clientNumber) {
    return <Navigate to="/" />;
  }

  return children;
}
