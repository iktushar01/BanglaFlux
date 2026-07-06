"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import mpegts from "mpegts.js";
import {
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StreamType = "hls" | "mpegts" | "mp4" | "unsupported";

function detectStreamType(url: string): StreamType {
  const lower = url.toLowerCase();
  if (lower.includes(".m3u8") || lower.includes("m3u8")) return "hls";
  if (lower.endsWith(".mp4")) return "mp4";
  if (lower.endsWith(".ts") || lower.includes(".ts?")) return "mpegts";
  if (lower.includes(".m3u8")) return "hls";
  return "hls";
}

interface HlsPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export function HlsPlayer({ url, title, className }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const mpegtsRef = useRef<ReturnType<typeof mpegts.createPlayer> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const cleanup = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (mpegtsRef.current) {
      mpegtsRef.current.destroy();
      mpegtsRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.removeAttribute("src");
      video.load();
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    cleanup();
    setLoading(true);
    setError(null);

    const streamType = detectStreamType(url);

    const onCanPlay = () => {
      setLoading(false);
      video.play().catch(() => setLoading(false));
    };

    const onError = () => {
      setLoading(false);
      setError("Unable to play this stream. It may be offline or blocked.");
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    try {
      if (streamType === "mp4") {
        video.src = url;
      } else if (streamType === "hls") {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true });
          hlsRef.current = hls;
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            video.play().catch(() => undefined);
          });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              setLoading(false);
              setError("Stream failed to load. Try again or pick another channel.");
            }
          });
        } else {
          setError("HLS is not supported in this browser.");
          setLoading(false);
        }
      } else if (streamType === "mpegts") {
        if (mpegts.isSupported()) {
          const player = mpegts.createPlayer(
            { type: "mpegts", url, isLive: true },
            { enableWorker: true },
          );
          mpegtsRef.current = player;
          player.attachMediaElement(video);
          player.load();
          player.play();
          player.on(mpegts.Events.ERROR, () => {
            setLoading(false);
            setError("MPEG-TS stream failed to load.");
          });
        } else {
          setError("MPEG-TS is not supported in this browser.");
          setLoading(false);
        }
      } else {
        setError("Unsupported stream format.");
        setLoading(false);
      }
    } catch {
      setLoading(false);
      setError("Failed to initialize player.");
    }

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      cleanup();
    };
  }, [url, retryKey, cleanup]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      await container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-lg bg-black",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        playsInline
        title={title}
      />

      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
          <Loader2 className="h-10 w-10 animate-spin text-brand" />
          <p className="text-sm text-zinc-300">Loading stream...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 p-6 text-center">
          <p className="max-w-md text-sm text-zinc-300">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setError(null);
              setRetryKey((k) => k + 1);
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {!error && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100">
          <Button size="icon" variant="ghost" onClick={togglePlay} className="text-white">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleMute} className="text-white">
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <div className="flex-1" />
          <Button size="icon" variant="ghost" onClick={toggleFullscreen} className="text-white">
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
