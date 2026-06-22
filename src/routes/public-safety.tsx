import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, StatCard, Badge } from "@/components/ui/kit";
import { useState } from "react";
import {
  ShieldAlert,
  Coins,
  Share2,
  PhoneCall,
  Smartphone,
  CheckCircle,
  FileText,
  UserX,
  Search,
  Eye,
  AlertOctagon,
  MessageCircle,
  ArrowRight,
  Send,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/public-safety")({
  head: () => ({
    meta: [
      { title: "Digital Public Safety — CNI Hub" },
      { name: "description", content: "AI platform for defeating counterfeit currency, fraud rings, and digital arrest scams." },
    ],
  }),
  component: PublicSafety,
});

// Mock transcripts for Digital Arrest Simulator
const scamSessions = [
  {
    id: "DA-9801",
    impersonation: "CBI Officer (Fake ID #8721)",
    threatLevel: "CRITICAL",
    scriptTemplate: "Digital Arrest for Money Laundering",
    transcript: [
      "Fraudster: This is Inspector General Sharma from CBI. Your Aadhaar card has been linked to a financial crime of Rs 24 Crore in Mumbai.",
      "Victim: But I have never been to Mumbai! This must be a mistake.",
      "Fraudster: Silence! Under Section 144, you are under digital arrest. You must keep your webcam active and you cannot leave the frame or speak to anyone, otherwise SWAT team will arrive at your home.",
      "Victim: Please, I am scared. Tell me what to do.",
      "Fraudster: Transfer Rs 5,00,000 as a security deposit to our verification clearance account. It will be refunded once clean.",
    ],
    metadata: {
      spoofingSig: "VOIP route via virtual gateway (+91 11 2301-XXXX spoof)",
      voiceAIFlag: "AI-generated voice modulation detected (89% match)",
      callerLocation: "Cross-border IP (Southeast Asia Compound)",
    },
  },
  {
    id: "DA-7392",
    impersonation: "Customs Officer (Fake ID #391)",
    threatLevel: "HIGH",
    scriptTemplate: "Illegal Narcotic Parcel Scam",
    transcript: [
      "Fraudster: Customs department here. We intercepted a DHL package sent from Taiwan to your address. It contains MDMA and 5 passports.",
      "Victim: I did not send or receive any package! I am a retired teacher.",
      "Fraudster: This is narcotics smuggling. We are transferring your call to ED department for security interrogation.",
      "Fraudster ED: We have a court warrant. You must transfer your savings to our audit treasury account immediately or face 10 years prison.",
    ],
    metadata: {
      spoofingSig: "Virtual SIM array mapping (+91-98711-XXXX)",
      voiceAIFlag: "Human voice, background scripted noise overlay",
      callerLocation: "Mewat Fraud Hotspot District",
    },
  },
];

const mockMuleNetwork = {
  centralHub: "Mule Account #872911 (State Bank of India, Jamtara)",
  totalLaundering: "Rs 1.48 Crore",
  linkages: [
    { type: "IP Address", val: "103.22.14.99 (Siam Reap, Cambodia)", trust: "98% risk" },
    { type: "SIM Card", val: "Spoofed IMSI Range #39281 (Mewat Hub)", trust: "92% risk" },
    { type: "Device ID", val: "Redmi Note 12 IMEI 86429...", trust: "95% risk" },
    { type: "Sub-Mule", val: "Account #981123 (BOB, Ranchi)", trust: "84% risk" },
    { type: "Sub-Mule", val: "Account #382910 (HDFC, Patna)", trust: "89% risk" },
  ],
};

function PublicSafety() {
  const [activeCallIdx, setActiveCallIdx] = useState(0);
  const [callStatus, setCallStatus] = useState<"idle" | "running" | "flagged" | "notified">("idle");
  const [currencyFile, setCurrencyFile] = useState<string | null>(null);
  const [currencyResult, setCurrencyResult] = useState<any | null>(null);
  const [whatsAppText, setWhatsAppText] = useState("");
  const [whatsAppFeed, setWhatsAppFeed] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Namaste, this is the Citizen Fraud Shield. Select a language or describe the call/message you just received." },
  ]);

  const activeCall = scamSessions[activeCallIdx];

  const handleSimulateCall = () => {
    setCallStatus("running");
    setTimeout(() => {
      setCallStatus("flagged");
    }, 1500);
  };

  const handleSendMHAAlert = () => {
    setCallStatus("notified");
  };

  const handleSimulateCurrency = (isFake: boolean) => {
    setCurrencyFile(isFake ? "scanned_rs500_note_suspicious.jpg" : "scanned_rs500_note_genuine.jpg");
    setCurrencyResult("analyzing");
    setTimeout(() => {
      if (isFake) {
        setCurrencyResult({
          valid: false,
          reason: "Counterfeit Detected",
          score: 98.4,
          details: {
            microprint: "FAILED (Blurred lettering under magnifying scanner)",
            securityThread: "FAILED (UV reflection pattern simulates 2023 series on 2016 paper)",
            serialNumber: "ALERT (Serial number '5AB 729104' matches 4 active reports in Delhi NCR)",
            uvSim: "Mismatch (Security ink does not fluoresce green at 365nm)",
          },
        });
      } else {
        setCurrencyResult({
          valid: true,
          reason: "Genuine Note",
          score: 99.1,
          details: {
            microprint: "PASSED (Clear 'RBI' and '500' microprint lines)",
            securityThread: "PASSED (Correct green-to-blue color shift)",
            serialNumber: "VALIDATED (Uniqueness verified in RBI issuance log)",
            uvSim: "Fluorescence verified (Correct green response)",
          },
        });
      }
    }, 1200);
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsAppText.trim()) return;

    const userMsg = whatsAppText;
    setWhatsAppFeed((prev) => [...prev, { sender: "user", text: userMsg }]);
    setWhatsAppText("");

    setTimeout(() => {
      let aiResponse = "";
      const msgLower = userMsg.toLowerCase();
      if (msgLower.includes("cbi") || msgLower.includes("arrest") || msgLower.includes("police")) {
        aiResponse = "🚨 WARNING (99% SCAM PROBABILITY): Government agencies like CBI, ED, police, or Customs will NEVER 'digitally arrest' you or demand money over a video call. Cut the call immediately. We are drafting an NCRB report template for you.";
      } else if (msgLower.includes("lottery") || msgLower.includes("won") || msgLower.includes("kbc")) {
        aiResponse = "⚠️ SCAM WARNING: This is a lottery/phishing scam. Never share OTPs or pay 'processing fees' to receive cash rewards.";
      } else {
        aiResponse = "ℹ️ Citizen Fraud Shield Verdict: Suspicious pattern. Do not click links or share bank details. Please report details directly to the National Cyber Crime Portal (1930).";
      }
      setWhatsAppFeed((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    }, 800);
  };

  return (
    <AppShell>
      <div className="mb-6 overflow-hidden rounded-2xl border border-border grid-bg p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-primary">
          <ShieldAlert className="h-4 w-4" /> AI-Powered Digital Public Safety Platform
        </div>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight lg:text-4xl">
          Defeating <span className="text-gradient">Counterfeiting, Fraud & scams</span> in smart cities.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Real-time call classifiers, machine vision counterfeit note detectors, and fraud mule network trackers built to shut down organized crime syndicates before mass victimization occurs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Module 1: Digital Arrest Scam Simulator */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold text-sm">Real-time Scam Classifier</h2>
                <p className="text-[10px] text-muted-foreground">Active VOIP / Call Flow Script Scanner</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => { setActiveCallIdx(0); setCallStatus("idle"); }}
                className={`px-2 py-1 text-xs rounded ${activeCallIdx === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-card"}`}
              >
                Case #1
              </button>
              <button
                onClick={() => { setActiveCallIdx(1); setCallStatus("idle"); }}
                className={`px-2 py-1 text-xs rounded ${activeCallIdx === 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-card"}`}
              >
                Case #2
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="rounded-lg bg-secondary/30 border border-border p-3">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Scenario Template:</span>
                <span className="font-semibold text-primary">{activeCall.scriptTemplate}</span>
              </div>
              <div className="space-y-2 text-xs font-mono max-h-48 overflow-y-auto bg-black/35 p-3 rounded border border-border/50">
                {activeCall.transcript.map((line, idx) => (
                  <div key={idx} className={line.startsWith("Fraudster") ? "text-danger" : "text-foreground"}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {callStatus === "idle" && (
              <button
                onClick={handleSimulateCall}
                className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-lg"
              >
                Simulate Active Call Session
              </button>
            )}

            {callStatus === "running" && (
              <div className="text-center py-4 text-xs text-muted-foreground animate-pulse">
                🔍 Inspecting voice acoustics and packet metadata...
              </div>
            )}

            {callStatus === "flagged" && (
              <div className="space-y-3 animate-in zoom-in-95 duration-200">
                <div className="border border-danger/40 bg-danger/10 text-danger rounded-lg p-3 text-xs flex items-start gap-2.5">
                  <AlertOctagon className="h-5 w-5 shrink-0" />
                  <div>
                    <div className="font-bold">🚨 HIGH-CONFIDENCE SCAM MATCH (98% Probability)</div>
                    <div className="mt-1">Metadata matches active illegal caller pattern. Spoofed Government ID detected.</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] rounded-lg bg-secondary/40 p-2.5 border border-border">
                  <div>
                    <span className="text-muted-foreground">Voice AI Fingerprint:</span>
                    <div className="font-semibold">{activeCall.metadata.voiceAIFlag}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Acoustic Location:</span>
                    <div className="font-semibold">{activeCall.metadata.callerLocation}</div>
                  </div>
                  <div className="col-span-2 mt-1.5 border-t border-border/50 pt-1.5">
                    <span className="text-muted-foreground">Telecom Gateway Signature:</span>
                    <div className="font-mono text-xs">{activeCall.metadata.spoofingSig}</div>
                  </div>
                </div>

                <button
                  onClick={handleSendMHAAlert}
                  className="w-full py-2.5 bg-danger text-white hover:bg-danger/90 text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" /> Dispatch MHA & Telecom Blocker Alert
                </button>
              </div>
            )}

            {callStatus === "notified" && (
              <div className="bg-success/15 border border-success/30 text-success text-center py-4 rounded-lg text-xs space-y-1 animate-in fade-in duration-200">
                <div className="font-bold">✔ MHA Alert Sent Automatically</div>
                <div className="text-[10px] text-muted-foreground">Scam signature pushed to Telecom Regulatory Blocklist and NCRB Registry.</div>
              </div>
            )}
          </div>
        </Card>

        {/* Module 2: Counterfeit Currency Identification */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Coins className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-sm">Counterfeit Currency Identification Agent</h2>
              <p className="text-[10px] text-muted-foreground">Microprint, UV and Serial Number Validator (Rs 500 fakes)</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="border border-dashed border-border rounded-xl p-6 text-center hover:bg-secondary/20 transition-colors">
              <span className="text-xs text-muted-foreground block mb-3">Upload Currency Scan or Sim Card photo</span>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleSimulateCurrency(false)}
                  className="px-4 py-2 border border-border bg-card text-xs rounded-lg hover:border-primary/50 text-foreground cursor-pointer"
                >
                  Scan Genuine Rs 500
                </button>
                <button
                  onClick={() => handleSimulateCurrency(true)}
                  className="px-4 py-2 border border-border bg-card text-xs rounded-lg hover:border-primary/50 text-foreground cursor-pointer"
                >
                  Scan Counterfeit Rs 500
                </button>
              </div>
            </div>

            {currencyResult === "analyzing" && (
              <div className="text-center py-8 text-xs text-muted-foreground animate-pulse">
                🔬 Processing microprint and analyzing UV thread reflectance patterns...
              </div>
            )}

            {currencyResult && currencyResult !== "analyzing" && (
              <div className="space-y-4 border border-border bg-secondary/30 p-4 rounded-xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-xs text-muted-foreground font-mono">File: {currencyFile}</span>
                  <Badge className={currencyResult.valid ? "bg-success/15 text-success border-success/30" : "bg-danger/15 text-danger border-danger/30"}>
                    {currencyResult.reason}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pattern Confidence Score:</span>
                    <span className="font-semibold text-foreground">{currencyResult.score}%</span>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Microprint Analysis:</span>
                      <span className="font-medium text-foreground">{currencyResult.details.microprint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Thread Verification:</span>
                      <span className="font-medium text-foreground">{currencyResult.details.securityThread}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serial Number Log:</span>
                      <span className="font-medium text-foreground">{currencyResult.details.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">UV Feature Simulation:</span>
                      <span className="font-medium text-foreground">{currencyResult.details.uvSim}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Module 3: Fraud Network Graph Intelligence */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Share2 className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-sm">Fraud Network Graph Intelligence</h2>
              <p className="text-[10px] text-muted-foreground">Clustering scammer infrastructure, mule bank accounts, and active shell registries</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-3">Identified Sybil Ring Linkages</span>
              <div className="space-y-2">
                <div className="border border-border bg-card p-3 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Central Target Registry:</span>
                    <div className="font-semibold text-foreground font-mono">{mockMuleNetwork.centralHub}</div>
                  </div>
                  <Badge className="bg-danger/15 text-danger border-danger/30">Target Cluster</Badge>
                </div>
                
                <div className="space-y-1.5">
                  {mockMuleNetwork.linkages.map((link, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 border border-border/50 bg-secondary/20 rounded-lg text-xs">
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">{link.type}:</span>
                        <span className="font-medium font-mono text-foreground">{link.val}</span>
                      </div>
                      <span className="text-[10px] text-danger font-semibold bg-danger/10 px-1.5 py-0.5 rounded">{link.trust}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between border border-border bg-black/25 rounded-xl p-4 min-h-[220px]">
              <div>
                <span className="text-xs font-semibold block mb-2 text-foreground">Multi-Agency Cluster Analysis</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The Graph AI agent has connected transaction logs with ISP locations and IMSI spoof codes. In total, **{mockMuleNetwork.totalLaundering}** has been routed through this cluster.
                </p>
              </div>

              <div className="mt-4 rounded-lg bg-secondary/50 border border-border p-3 text-xs space-y-2">
                <div className="font-bold text-foreground">Court-Admissible Evidence Dossier</div>
                <p className="text-[10px] text-muted-foreground">The generated intelligence packet contains verified IP handshakes, KYC compliance overrides, and CDR (Call Detail Record) linkages ready for legal prosecution.</p>
                <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1.5 mt-1">
                  <FileText className="h-3.5 w-3.5" /> Download Evidence PDF Packet <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Module 4: Citizen Fraud Shield (Multi-channel) */}
        <Card className="lg:col-span-2 flex flex-col h-[380px]">
          <div className="mb-3 flex items-center gap-2 border-b border-border pb-2.5">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-sm">Citizen Fraud Shield (WhatsApp Simulation)</h2>
              <p className="text-[10px] text-muted-foreground">Conversational Risk Assessment & Guided NCRB Reporting (12 Regional Languages)</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-secondary/15 border border-border rounded-xl p-4">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none mb-3">
              {whatsAppFeed.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs ${
                    msg.sender === "user" 
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-none" 
                      : "bg-card border border-border text-foreground rounded-tl-none shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleWhatsAppSend} className="flex gap-2">
              <input
                value={whatsAppText}
                onChange={(e) => setWhatsAppText(e.target.value)}
                placeholder="Ask about a message: e.g. 'I got a call saying I am under digital arrest by police'"
                className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold rounded-lg hover:bg-primary/95 flex items-center gap-1 cursor-pointer"
              >
                Send <Send className="h-3 w-3" />
              </button>
            </form>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
