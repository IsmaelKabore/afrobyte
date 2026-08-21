import { redirect } from "next/navigation";

// Les pages de remboursement en cash ont été retirées → redirection vers l'accueil
// (les remboursements sont gérés dans l'application).
export default function RefundPage() {
  redirect("/");
}
