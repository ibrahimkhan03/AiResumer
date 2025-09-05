import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter, DialogClose, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface AISummaryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultPosition?: string;
  onSelectSummary: (summary: string) => void;
}

export const AISummaryModal: React.FC<AISummaryModalProps> = ({
  open,
  setOpen,
  defaultPosition = "",
  onSelectSummary,
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [skills, setSkills] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    if (!position || !skills) {
      setError("Position and Skills are required.");
      return;
    }
    setError("");
    setLoading(true);
  setSummary("");
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positionHighlight: position, skillsHighlight: skills, customPrompt }),
      });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setError(data.error || "Failed to generate summary.");
      }
    } catch (e) {
      setError("Failed to generate summary.");
    }
    setLoading(false);
  };

  const handleSelect = (summary: string) => {
  onSelectSummary(summary);
  setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Resume Summary Generator</DialogTitle>
        </DialogHeader>
        <label>Position (editable):</label>
        <Input value={position} onChange={e => setPosition(e.target.value)} placeholder="Position" required />
        <label>Skills (required):</label>
        <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills" required />
        <label>Custom Prompt / Your Summary (optional):</label>
        <Textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Custom prompt or your own summary..." />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "AI Generate"}
        </Button>
        {summary && (
          <div style={{ marginTop: 16 }}>
            <div><b>Generated Summary:</b></div>
            <div style={{ margin: "8px 0", border: "1px solid #ccc", padding: 8, borderRadius: 4 }}>
              <div>{summary}</div>
              <Button style={{ marginTop: 8 }} onClick={() => handleSelect(summary)}>
                Use This Summary
              </Button>
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
