"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, ShieldCheck, ShieldAlert, FileText, Download, Mail, CheckCircle2, Globe, Lock, Zap, AlertTriangle, Newspaper, User, TrendingUp, ExternalLink } from "lucide-react";

interface MatchResult {
  caption: string;
  schema: string;
  score: number;
  datasets: string[];
  properties: Record<string, string[]>;
  topics: string[];
}

interface AdverseArticle {
  title: string;
  url: string;
  source: string;
  date: string;
}

interface EntityInfo {
  label: string;
  description: string;
  birthDate?: string;
  nationality?: string;
  occupation?: string;
  imageUrl?: string;
  wikipediaUrl?: string;
}

interface ScreeningResponse {
  query_id: string;
  query: string;
  entity_type: string;
  timestamp: string;
  risk_score: number;
  risk_level: string;
  risk_factors: string[];
  sanctions: {
    total_matches: number;
    datasets_checked: number;
    results: MatchResult[];
  };
  entity_info: EntityInfo | null;
  adverse_media: {
    total_articles: number;
    sources_checked: string;
    articles: AdverseArticle[];
  };
  summary: {
    status: string;
    recommendations: string;
    data_sources: string[];
  };
}

const riskColors: Record<string, string> = {
  Low: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  High: "text-orange-600 bg-orange-50 border-orange-200",
  Critical: "text-red-600 bg-red-50 border-red-200",
};

const riskBarColors: Record<string, string> = {
  Low: "bg-emerald-500",
  Medium: "bg-amber-500",
  High: "bg-orange-500",
  Critical: "bg-red-500",
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityType, setEntityType] = useState<"Person" | "Company">("Person");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sanctions" | "adverse" | "entity">("sanctions");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: searchQuery, type: entityType }),
      });

      if (!response.ok) throw new Error(`Screening failed: ${response.statusText}`);
      const data: ScreeningResponse = await response.json();
      setResult(data);
      setActiveTab("sanctions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `KYC_Report_${searchQuery.replace(/\s+/g, "_")}_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setError("Failed to generate report");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-600" />
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">VerifyKYC</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">by AliceLabs LLC</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex text-xs">
              <Globe className="h-3 w-3 mr-1" />490 datasets
            </Badge>
            <Badge variant="outline" className="hidden sm:flex text-xs">
              <Newspaper className="h-3 w-3 mr-1" />235K news sources
            </Badge>
            <Badge variant="outline" className="hidden sm:flex text-xs">
              <Zap className="h-3 w-3 mr-1" />Instant
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero + Search */}
      <section className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            KYC Screening with <span className="text-emerald-600">Risk Score</span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Screen against 490+ sanctions lists, 235K news sources, and Wikidata — with instant risk scoring and PDF reports.
          </p>
        </div>

        {/* Search Card */}
        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-emerald-600" />
              Screening Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    entityType === "Person" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                  }`}
                  onClick={() => setEntityType("Person")}
                >Person</button>
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    entityType === "Company" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                  }`}
                  onClick={() => setEntityType("Company")}
                >Company</button>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={entityType === "Person" ? "e.g. Vladimir Putin" : "e.g. Petroleos de Venezuela"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-11"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                {loading ? "Scanning..." : "Screen"}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                {/* Risk Score Banner */}
                <div className={`flex items-center justify-between flex-wrap gap-3 p-4 rounded-lg border ${riskColors[result.risk_level] || ""}`}>
                  <div className="flex items-center gap-3">
                    {result.risk_level === "Low" ? (
                      <CheckCircle2 className="h-7 w-7" />
                    ) : (
                      <ShieldAlert className="h-7 w-7" />
                    )}
                    <div>
                      <p className="text-xl font-bold">
                        Risk: {result.risk_level} ({result.risk_score}/100)
                      </p>
                      <p className="text-sm opacity-80">{result.summary.recommendations}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" /> PDF
                    </Button>
                    <Button
                      onClick={() => {
                        const subject = encodeURIComponent(`KYC Report: ${searchQuery}`);
                        const body = encodeURIComponent(`Risk: ${result.risk_level} (${result.risk_score}/100)\nMatches: ${result.sanctions.total_matches}\nAdverse media: ${result.adverse_media.total_articles}\nReport ID: ${result.query_id}`);
                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                      }}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Mail className="h-3 w-3" /> Email
                    </Button>
                  </div>
                </div>

                {/* Risk Score Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${riskBarColors[result.risk_level] || "bg-slate-500"} transition-all duration-500`}
                    style={{ width: `${Math.max(result.risk_score, 3)}%` }}
                  />
                </div>

                {/* Risk Factors */}
                {result.risk_factors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {result.risk_factors.map((factor, i) => (
                      <Badge key={i} variant="outline" className="text-xs gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        {factor}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
                  <button
                    className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === "sanctions" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500"}`}
                    onClick={() => setActiveTab("sanctions")}
                  >
                    Sanctions ({result.sanctions.total_matches})
                  </button>
                  <button
                    className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === "adverse" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500"}`}
                    onClick={() => setActiveTab("adverse")}
                  >
                    Adverse Media ({result.adverse_media.total_articles})
                  </button>
                  <button
                    className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === "entity" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500"}`}
                    onClick={() => setActiveTab("entity")}
                  >
                    Entity Info
                  </button>
                </div>

                {/* Tab Content */}
                <div className="max-h-96 overflow-y-auto">
                  {/* Sanctions Tab */}
                  {activeTab === "sanctions" && (
                    <div className="space-y-3">
                      {result.sanctions.results.length === 0 ? (
                        <div className="flex items-center gap-2 p-4 text-emerald-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <p>No sanctions matches found across 490 datasets.</p>
                        </div>
                      ) : (
                        result.sanctions.results.map((match, i) => (
                          <Card key={i} className="border-l-4 border-l-red-500">
                            <CardContent className="pt-3 pb-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-semibold text-sm">{match.caption}</h5>
                                    <Badge variant="secondary" className="text-xs">{match.schema}</Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 text-xs">
                                    <div>
                                      <span className="text-slate-500">Score:</span>{" "}
                                      <span className={`font-semibold ${match.score >= 0.9 ? "text-red-600" : "text-amber-600"}`}>
                                        {(match.score * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                    {match.properties.birthDate?.[0] && (
                                      <div><span className="text-slate-500">Birth:</span> <span className="font-medium">{match.properties.birthDate[0]}</span></div>
                                    )}
                                    {match.properties.nationality?.[0] && (
                                      <div><span className="text-slate-500">Nationality:</span> <span className="font-medium">{match.properties.nationality[0]}</span></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {match.datasets.slice(0, 6).map((ds) => (
                                  <Badge key={ds} variant="outline" className="text-[10px]">{ds}</Badge>
                                ))}
                                {match.datasets.length > 6 && (
                                  <Badge variant="outline" className="text-[10px]">+{match.datasets.length - 6} more</Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}

                  {/* Adverse Media Tab */}
                  {activeTab === "adverse" && (
                    <div className="space-y-2">
                      {result.adverse_media.articles.length === 0 ? (
                        <div className="flex items-center gap-2 p-4 text-emerald-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <p className="text-sm">No adverse media found across 235K+ news sources.</p>
                        </div>
                      ) : (
                        result.adverse_media.articles.map((article, i) => (
                          <a
                            key={i}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">{article.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-[10px]">{article.source}</Badge>
                                  <span className="text-xs text-slate-400">{article.date}</span>
                                </div>
                              </div>
                              <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
                            </div>
                          </a>
                        ))
                      )}
                    </div>
                  )}

                  {/* Entity Info Tab */}
                  {activeTab === "entity" && (
                    <div>
                      {result.entity_info ? (
                        <div className="flex gap-4">
                          {result.entity_info.imageUrl && (
                            <img
                              src={result.entity_info.imageUrl}
                              alt={result.entity_info.label}
                              className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                            />
                          )}
                          <div className="space-y-2 flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {result.entity_info.label}
                            </h4>
                            <p className="text-sm text-slate-500">{result.entity_info.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {result.entity_info.birthDate && (
                                <div><span className="text-slate-500">Birth Date:</span> <span className="font-medium">{result.entity_info.birthDate}</span></div>
                              )}
                              {result.entity_info.nationality && (
                                <div><span className="text-slate-500">Nationality:</span> <span className="font-medium">{result.entity_info.nationality}</span></div>
                              )}
                              {result.entity_info.occupation && (
                                <div><span className="text-slate-500">Occupation:</span> <span className="font-medium">{result.entity_info.occupation}</span></div>
                              )}
                            </div>
                            {result.entity_info.wikipediaUrl && (
                              <a href={result.entity_info.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline">
                                <ExternalLink className="h-3 w-3" /> Wikipedia
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-4 text-slate-400">
                          <User className="h-5 w-5" />
                          <p className="text-sm">No entity information found in Wikidata.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  Report ID: {result.query_id} · {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        {!result && !loading && (
          <div className="grid md:grid-cols-4 gap-3 mt-8">
            <Card>
              <CardContent className="pt-4 text-center">
                <Globe className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">490+ Sanctions Lists</h3>
                <p className="text-xs text-slate-500">OFAC, EU, UN, UK + 30 countries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <Newspaper className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Adverse Media</h3>
                <p className="text-xs text-slate-500">235K+ news sources screened</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Risk Score</h3>
                <p className="text-xs text-slate-500">0-100 score with risk factors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <FileText className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">PDF Reports</h3>
                <p className="text-xs text-slate-500">Professional, downloadable</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing */}
        {!result && !loading && (
          <div className="mt-8">
            <h3 className="text-center text-xl font-bold mb-4 text-slate-900 dark:text-white">Pricing</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Card className="text-center">
                <CardContent className="pt-4 pb-4">
                  <h4 className="font-semibold mb-1">Free</h4>
                  <p className="text-2xl font-bold text-emerald-600 mb-1">$0<span className="text-sm font-normal">/mo</span></p>
                  <p className="text-xs text-slate-500 mb-3">5 screenings / month</p>
                  <ul className="text-xs text-left space-y-1 text-slate-600 dark:text-slate-400">
                    <li>✓ Sanctions screening</li>
                    <li>✓ Risk score</li>
                    <li>✗ Adverse media</li>
                    <li>✗ PDF reports</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-emerald-500 border-2 text-center relative">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-xs">Popular</Badge>
                <CardContent className="pt-4 pb-4">
                  <h4 className="font-semibold mb-1">Pro</h4>
                  <p className="text-2xl font-bold text-emerald-600 mb-1">$99<span className="text-sm font-normal">/mo</span></p>
                  <p className="text-xs text-slate-500 mb-3">100 screenings / month</p>
                  <ul className="text-xs text-left space-y-1 text-slate-600 dark:text-slate-400">
                    <li>✓ Sanctions + adverse media</li>
                    <li>✓ Risk score + factors</li>
                    <li>✓ PDF reports</li>
                    <li>✓ Entity enrichment</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-4 pb-4">
                  <h4 className="font-semibold mb-1">Business</h4>
                  <p className="text-2xl font-bold text-emerald-600 mb-1">$299<span className="text-sm font-normal">/mo</span></p>
                  <p className="text-xs text-slate-500 mb-3">500 screenings / month</p>
                  <ul className="text-xs text-left space-y-1 text-slate-600 dark:text-slate-400">
                    <li>✓ Everything in Pro</li>
                    <li>✓ Multi-user access</li>
                    <li>✓ Batch screening API</li>
                    <li>✓ Priority support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>VerifyKYC by AliceLabs LLC · USA / Ecuador</p>
          <p className="mt-1">OpenSanctions · Wikidata · GDELT · Not legal advice</p>
          <p className="mt-1 text-[10px]">Contact: eddyflores100@gmail.com · LLC registered in USA</p>
        </div>
      </footer>
    </div>
  );
}
