"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, ShieldCheck, ShieldAlert, FileText, Download, Mail, CheckCircle2, Globe, Lock, Zap } from "lucide-react";

interface MatchResult {
  caption: string;
  schema: string;
  score: number;
  datasets: string[];
  properties: Record<string, string[]>;
  topics: string[];
}

interface ScreeningResponse {
  query_id: string;
  query: string;
  total_matches: number;
  results: MatchResult[];
  timestamp: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entityType, setEntityType] = useState<"Person" | "Company">("Person");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      if (!response.ok) {
        throw new Error(`Screening failed: ${response.statusText}`);
      }

      const data: ScreeningResponse = await response.json();
      setResult(data);
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
      a.download = `KYC_Report_${searchQuery.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to generate PDF report");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">VerifyKYC</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">by AliceLabs LLC</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:flex">
              <Globe className="h-3 w-3 mr-1" />
              490 datasets
            </Badge>
            <Badge variant="outline" className="hidden sm:flex">
              <Lock className="h-3 w-3 mr-1" />
              30+ countries
            </Badge>
            <Badge variant="outline" className="hidden sm:flex">
              <Zap className="h-3 w-3 mr-1" />
              Instant results
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero + Search */}
      <section className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Sanctions Screening <span className="text-emerald-600">in seconds</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Screen any person or company against 490+ global sanctions, PEP, and watchlists.
            Get instant results and a professional PDF report.
          </p>
        </div>

        {/* Search Card */}
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-emerald-600" />
              Screening Search
            </CardTitle>
            <CardDescription>
              Enter a name or company to screen against global sanctions lists
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    entityType === "Person"
                      ? "bg-emerald-600 text-white"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setEntityType("Person")}
                >
                  Person
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    entityType === "Company"
                      ? "bg-emerald-600 text-white"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setEntityType("Company")}
                >
                  Company
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={entityType === "Person" ? "e.g. Vladimir Putin" : "e.g. Petroleos de Venezuela"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-12 text-base"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Screening...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Screen
                  </>
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                {/* Summary */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    {result.total_matches > 0 ? (
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="text-lg font-bold text-red-600">
                            {result.total_matches} match{result.total_matches > 1 ? "es" : ""} found
                          </p>
                          <p className="text-sm text-slate-500">Potential risk detected</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="text-lg font-bold text-emerald-600">No matches found</p>
                          <p className="text-sm text-slate-500">Entity appears clear</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => {
                        const subject = encodeURIComponent(`KYC Screening Report: ${searchQuery}`);
                        const body = encodeURIComponent(
                          `Screening results for: ${searchQuery}\n\n` +
                          `Matches: ${result.total_matches}\n\n` +
                          `Report generated: ${result.timestamp}\n\n` +
                          `View full report at VerifyKYC by AliceLabs LLC`
                        );
                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                      }}
                      variant="outline"
                      className="gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  </div>
                </div>

                {/* Match Details */}
                {result.results.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Match Details
                    </h4>
                    {result.results.map((match, i) => (
                      <Card key={i} className="border-l-4 border-l-red-500">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-semibold text-slate-900 dark:text-white">
                                  {match.caption}
                                </h5>
                                <Badge variant="secondary">{match.schema}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-slate-500">Match Score:</span>{" "}
                                  <span className={`font-semibold ${match.score >= 0.9 ? "text-red-600" : "text-amber-600"}`}>
                                    {(match.score * 100).toFixed(1)}%
                                  </span>
                                </div>
                                {match.properties.birthDate?.[0] && (
                                  <div>
                                    <span className="text-slate-500">Birth Date:</span>{" "}
                                    <span className="font-medium">{match.properties.birthDate[0]}</span>
                                  </div>
                                )}
                                {match.properties.nationality?.[0] && (
                                  <div>
                                    <span className="text-slate-500">Nationality:</span>{" "}
                                    <span className="font-medium">{match.properties.nationality[0]}</span>
                                  </div>
                                )}
                                {match.properties.country?.[0] && (
                                  <div>
                                    <span className="text-slate-500">Country:</span>{" "}
                                    <span className="font-medium">{match.properties.country[0]}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Datasets */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {match.datasets.slice(0, 8).map((ds) => (
                              <Badge key={ds} variant="outline" className="text-xs">
                                {ds}
                              </Badge>
                            ))}
                            {match.datasets.length > 8 && (
                              <Badge variant="outline" className="text-xs">
                                +{match.datasets.length - 8} more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="text-xs text-slate-400 dark:text-slate-500 pt-2">
                  Report ID: {result.query_id} · Generated: {new Date(result.timestamp).toLocaleString()} ·
                  Powered by OpenSanctions · AliceLabs LLC
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        {!result && !loading && (
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Globe className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">490+ Datasets</h3>
                <p className="text-sm text-slate-500">OFAC, EU, UN, UK + 30 countries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Zap className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Instant Results</h3>
                <p className="text-sm text-slate-500">Screening in under 3 seconds</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">PDF Reports</h3>
                <p className="text-sm text-slate-500">Professional, downloadable reports</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing */}
        {!result && !loading && (
          <div className="mt-12">
            <h3 className="text-center text-2xl font-bold mb-6 text-slate-900 dark:text-white">Pricing</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-2">Free</h4>
                  <p className="text-3xl font-bold text-emerald-600 mb-2">$0</p>
                  <p className="text-sm text-slate-500 mb-4">5 screenings / month</p>
                  <ul className="text-sm text-left space-y-1 text-slate-600 dark:text-slate-400">
                    <li>✓ Instant results</li>
                    <li>✓ Basic match details</li>
                    <li>✗ PDF reports</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-emerald-500 border-2 text-center relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600">Popular</Badge>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-2">Pro</h4>
                  <p className="text-3xl font-bold text-emerald-600 mb-2">$99<span className="text-base font-normal">/mo</span></p>
                  <p className="text-sm text-slate-500 mb-4">100 screenings / month</p>
                  <ul className="text-sm text-left space-y-1 text-slate-600 dark:text-slate-400">
                    <li>✓ Instant results</li>
                    <li>✓ Full match details</li>
                    <li>✓ PDF reports</li>
                    <li>✓ API access</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-lg mb-2">Business</h4>
                  <p className="text-3xl font-bold text-emerald-600 mb-2">$299<span className="text-base font-normal">/mo</span></p>
                  <p className="text-sm text-slate-500 mb-4">500 screenings / month</p>
                  <ul className="text-sm text-left space-y-1 text-slate-600 dark:text-slate-400">
                    <li>✓ Everything in Pro</li>
                    <li>✓ Multi-user access</li>
                    <li>✓ Batch screening</li>
                    <li>✓ Priority support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>VerifyKYC by AliceLabs LLC · Ecuador / USA</p>
          <p className="mt-1">
            Data provided by OpenSanctions · 490 datasets · Not legal advice
          </p>
          <p className="mt-2 text-xs">
            Contact: eddyflores100@gmail.com · LLC registered in USA
          </p>
        </div>
      </footer>
    </div>
  );
}
