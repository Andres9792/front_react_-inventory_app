import React, { useMemo, useState } from "react";
import type { SF200Response, SF200Device } from "../../models/feeders";

export default function SF200Viewer({ data }: { data?: SF200Response }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState<keyof SF200Device>("Name");
  const [asc, setAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 100;

  // ✅ Evita errores si data o devices no existen
  const safeDevices = data?.devices ?? [];

  // Tipos únicos
  const types = useMemo(() => {
    const set = new Set<string>();
    safeDevices.forEach((d) => set.add(d.Type || "Unknown"));
    return ["Todos", ...Array.from(set)];
  }, [safeDevices]);

  // Búsqueda + filtro
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return safeDevices.filter((d) => {
      const matchesType =
        typeFilter === "Todos" || (d.Type || "Unknown") === typeFilter;
      const matchesQuery =
        !q ||
        d.Name?.toLowerCase().includes(q) ||
        d.Model?.toLowerCase().includes(q) ||
        d.Serial?.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [safeDevices, search, typeFilter]);

  // Ordenar
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const A = (a[sortBy] ?? "") as any;
      const B = (b[sortBy] ?? "") as any;

      if (sortBy === "Battery_V" || sortBy === "RSSI" || sortBy === "Kg_Fed") {
        const an = A == null ? -Infinity : Number(A);
        const bn = B == null ? -Infinity : Number(B);
        return asc ? an - bn : bn - an;
      }
      if (sortBy === "Last_Heard" && A && B) {
        const an = new Date(A).getTime();
        const bn = new Date(B).getTime();
        return asc ? an - bn : bn - an;
      }
      const as = (A ?? "").toString().toLowerCase();
      const bs = (B ?? "").toString().toLowerCase();
      if (as < bs) return asc ? -1 : 1;
      if (as > bs) return asc ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortBy, asc]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData =
    sorted.length > pageSize
      ? sorted.slice((page - 1) * pageSize, page * pageSize)
      : sorted;

  const toggleSort = (key: keyof SF200Device) => {
    if (sortBy === key) setAsc(!asc);
    else {
      setSortBy(key);
      setAsc(true);
    }
  };
  const fmt = (v: any, f = "—") => (v == null || v === "" ? f : v);
  const fmtTime = (s?: string | null) =>
    s ? new Date(s).toLocaleString("es-EC") : "—";

  // ✅ Si no hay datos, mostramos un mensaje amigable
  if (!data || safeDevices.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e0e0e0",
          padding: 20,
          textAlign: "center",
          color: "#666",
        }}
      >
        <strong>SF200 ({data?.ip ?? "—"})</strong>
        <p style={{ marginTop: 10 }}>No hay dispositivos disponibles.</p>
      </div>
    );
  }

  // ✅ Render normal si hay datos
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e0e0e0",
        padding: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <strong style={{ fontSize: 15 }}>SF200 ({data.ip})</strong>
        <span style={{ color: "#666" }}>Total: {data.total_devices}</span>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar nombre, modelo o serial..."
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "7px 10px",
            minWidth: 250,
            outline: "none",
            fontSize: 13.5,
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
          }}
        />

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "7px 10px",
            fontSize: 13.5,
            background: "#fafafa",
            cursor: "pointer",
          }}
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <span style={{ marginLeft: "auto", color: "#999", fontSize: 12 }}>
          {sorted.length} resultados
        </span>
      </div>

      <div
        style={{
          maxHeight: sorted.length > 100 ? "600px" : "auto",
          overflowY: sorted.length > 100 ? "auto" : "visible",
          border: "1px solid #eee",
          borderRadius: 6,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13.5,
          }}
        >
          <thead style={{ background: "#f7f9fc", position: "sticky", top: 0 }}>
            <tr>
              {[
                ["Name", "Name"],
                ["Serial", "Serial"],
                ["Model", "Model"],
                ["Battery_V", "Battery (V)"],
                ["FW", "FW"],
                ["RSSI", "RSSI"],
                ["Kg_Fed", "Kg Fed"],
                ["Latitude", "Latitude"],
                ["Longitude", "Longitude"],
                ["Last_Heard", "Last Heard"],
                ["Type", "Type"],
              ].map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key as keyof SF200Device)}
                  style={{
                    textAlign:
                      key === "Battery_V" || key === "RSSI" || key === "Kg_Fed"
                        ? "right"
                        : "left",
                    padding: "8px 10px",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  {label}
                  {sortBy === key ? (asc ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageData.map((d) => (
              <tr key={d.Serial} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={td}>{fmt(d.Name)}</td>
                <td style={td}>{fmt(d.Serial)}</td>
                <td style={td}>{fmt(d.Model)}</td>
                <td style={{ ...td, textAlign: "right" }}>
                  {fmt(d.Battery_V)}
                </td>
                <td style={td}>{fmt(d.FW)}</td>
                <td style={{ ...td, textAlign: "right" }}>{fmt(d.RSSI)}</td>
                <td style={{ ...td, textAlign: "right" }}>{fmt(d.Kg_Fed)}</td>
                <td style={{ ...td, textAlign: "right" }}>{fmt(d.Latitude)}</td>
                <td style={{ ...td, textAlign: "right" }}>
                  {fmt(d.Longitude)}
                </td>
                <td style={td}>{fmtTime(d.Last_Heard)}</td>
                <td style={td}>{fmt(d.Type)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const td: React.CSSProperties = {
  padding: "6px 8px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
