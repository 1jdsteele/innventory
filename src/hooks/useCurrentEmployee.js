// src/hooks/useCurrentEmployee.js
import { useEffect, useState } from "react";

/**
 * Reads "currentEmployee" from localStorage and exposes:
 * - orgId (number or string)
 * - isManager (boolean)
 * - authError (string | null)
 * - authLoading (boolean)
 */
export default function useCurrentEmployee() {
  const [orgId, setOrgId] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentEmployee");

      if (!raw) {
        setAuthError("No logged-in employee found. Please log in again.");
        setAuthLoading(false);
        return;
      }

      const emp = JSON.parse(raw);

      if (!emp.organizationId) {
        setAuthError("Your account is not linked to an organization.");
        setAuthLoading(false);
        return;
      }

      setOrgId(emp.organizationId);
      setIsManager(emp.role === "Manager");
    } catch (e) {
      console.error(e);
      setAuthError("Failed to read employee info. Please log in again.");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  return { orgId, isManager, authError, authLoading };
}
