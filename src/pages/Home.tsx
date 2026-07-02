import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ProviderCard from "../components/ProviderCard";
import { getFilterOptions } from "../hooks/useProviders";
import { analytics } from "../utils/analytics";
import type { Provider } from "../types";
import "./Home.css";

interface Props {
  providers: Provider[];
  loading: boolean;
  error: string | null;
  isUsingFallback: boolean;
}

export default function Home({
  providers,
  loading,
  error,
  isUsingFallback,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeService, setService] = useState("");
  const [activeLocality, setLocality] = useState("");

  const { services, localities } = useMemo(
    () => getFilterOptions(providers),
    [providers],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return providers.filter((p) => {
      const matchSearch =
        !q ||
        [
          p.name,
          ...p.services,
          ...p.conditions,
          p.centreLocality,
          ...p.hvLocalities,
        ].some((f) => f.toLowerCase().includes(q));

      const matchService =
        !activeService || p.services.some((s) => s === activeService);
      const matchLocality =
        !activeLocality || p.localities.some((l) => l === activeLocality);

      return matchSearch && matchService && matchLocality;
    });
  }, [providers, search, activeService, activeLocality]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
    if (val.length > 2) analytics.searchUsed(val);
  }

  function handleService(svc: string) {
    const next = activeService === svc ? "" : svc;
    setService(next);
    if (next) analytics.serviceFiltered(next);
  }

  function handleLocality(loc: string) {
    const next = activeLocality === loc ? "" : loc;
    setLocality(next);
    if (next) analytics.localityFiltered(next);
  }

  return (
    <div className="home">
      <header className="home-header">
        <div className="header-top">
          <div>
            <h1 className="app-name">WayFinder</h1>
            <p className="app-sub">Special needs providers · Chennai</p>
          </div>
          <Link
            to="/feedback"
            className="feedback-btn"
            onClick={analytics.feedbackOpened}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M14 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3l3 3 3-3h3a1 1 0 001-1V3a1 1 0 00-1-1z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            Feedback
          </Link>
        </div>
      </header>

      <div className="home-body">
        {isUsingFallback && (
          <div className="fallback-banner">
            Showing sample data — connect your Google Sheet in{" "}
            <code>src/config.ts</code>
          </div>
        )}

        {error && !isUsingFallback && (
          <div className="error-banner">
            Couldn't load live data. Showing sample providers instead.
          </div>
        )}

        {/* Search */}
        <div className="search-wrap">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 10l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            className="search-input"
            placeholder="Search by name, therapy type, condition…"
            value={search}
            onChange={handleSearch}
            aria-label="Search providers"
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 3l8 8M11 3l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Service filter pills */}
        <div className="filter-row" role="group" aria-label="Filter by service">
          <button
            className={`pill ${!activeService ? "pill-active" : ""}`}
            onClick={() => handleService("")}
          >
            All services
          </button>
          {services.map((s) => (
            <button
              key={s}
              className={`pill ${activeService === s ? "pill-active" : ""}`}
              onClick={() => handleService(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Locality filter pills */}
        <div className="filter-row" role="group" aria-label="Filter by area">
          <button
            className={`pill ${!activeLocality ? "pill-active" : ""}`}
            onClick={() => handleLocality("")}
          >
            All areas
          </button>
          {localities.map((l) => (
            <button
              key={l}
              className={`pill ${activeLocality === l ? "pill-active" : ""}`}
              onClick={() => handleLocality(l)}
            >
              {l}
            </button>
          ))}
        </div>

        <p className="results-count">
          {loading
            ? "Loading providers…"
            : `${filtered.length} provider${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Provider list */}
        {loading ? (
          <div className="loading-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No providers found</p>
            <p className="empty-sub">
              Try a different search or remove a filter.
            </p>
          </div>
        ) : (
          <div className="provider-list">
            {filtered.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        )}

        {/* Recommend CTA */}
        <div className="recommend-cta">
          <p className="cta-text">Know a great provider not listed here?</p>
          <a
            href="YOUR_FORM_1_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn"
          >
            Recommend a provider
          </a>
        </div>
      </div>
    </div>
  );
}
