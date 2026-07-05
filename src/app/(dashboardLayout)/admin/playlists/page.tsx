"use client";

import { useState } from "react";
import { Loader2, Upload, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { importPlaylistFromFile, importPlaylistFromUrl } from "@/services/channel/channel.services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminPlaylistsPage() {
  const [title, setTitle] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    imported: number;
    skipped: number;
    invalid: number;
  } | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      toast.error("Title and M3U file are required");
      return;
    }

    setFileLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("file", file);
      const result = await importPlaylistFromFile(formData);
      setLastResult(result ?? null);
      toast.success(
        `Imported ${result?.imported ?? 0} channels (${result?.skipped ?? 0} skipped)`,
      );
      setFile(null);
    } catch {
      toast.error("Failed to import playlist");
    } finally {
      setFileLoading(false);
    }
  };

  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlTitle.trim() || !url.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    setUrlLoading(true);
    try {
      const result = await importPlaylistFromUrl(urlTitle.trim(), url.trim());
      setLastResult(result ?? null);
      toast.success(
        `Imported ${result?.imported ?? 0} channels (${result?.skipped ?? 0} skipped)`,
      );
    } catch {
      toast.error("Failed to fetch or import playlist URL");
    } finally {
      setUrlLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-1">
      <div>
        <h1 className="text-2xl font-bold">Upload Playlist</h1>
        <p className="text-muted-foreground">
          Import channels from an M3U file or remote URL.
        </p>
      </div>

      <Alert>
        <AlertDescription>
          New channels are added automatically. Duplicates with the same stream URL are skipped.
        </AlertDescription>
      </Alert>

      {lastResult && (
        <Alert className="border-green-800 bg-green-950/30">
          <AlertDescription>
            Last import: {lastResult.imported} added, {lastResult.skipped} skipped,{" "}
            {lastResult.invalid} invalid entries.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload M3U File
          </CardTitle>
          <CardDescription>.m3u, .m3u8, or .txt (max 5MB)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-title">Playlist Title</Label>
              <Input
                id="file-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Sports Channels"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="m3u-file">M3U File</Label>
              <Input
                id="m3u-file"
                type="file"
                accept=".m3u,.m3u8,.txt"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="submit" disabled={fileLoading} className="w-full">
              {fileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Import Playlist"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Import from URL
          </CardTitle>
          <CardDescription>Paste a direct link to an M3U playlist</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUrlImport} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url-title">Playlist Title</Label>
              <Input
                id="url-title"
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
                placeholder="Remote Playlist"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="m3u-url">M3U URL</Label>
              <Input
                id="m3u-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/playlist.m3u"
              />
            </div>
            <Button type="submit" disabled={urlLoading} className="w-full">
              {urlLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch & Import"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
