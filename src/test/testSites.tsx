import { useState, useEffect } from "react";
import { getSites } from "../api/siteApi";
import type { Site } from "../models/siteModels";

export default function TestSites() {
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    getSites().then(setSites);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Sites</h2>
      <ul>
        {sites.map((s) => (
          <li key={s.id}>
            <strong>{s.company_name}</strong> — {s.country}
          </li>
        ))}
      </ul>
    </div>
  );
}
