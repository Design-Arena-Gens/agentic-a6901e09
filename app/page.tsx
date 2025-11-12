"use client";

import { useEffect, useMemo, useState } from 'react';

function extractYouTubeId(input: string): string | null {
  try {
    // Trim and handle raw IDs
    const raw = input.trim();
    const idLike = /^[a-zA-Z0-9_-]{11}$/;
    if (idLike.test(raw)) return raw;

    // Try parsing as URL
    const url = new URL(raw);

    // youtu.be/<id>
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id?.length === 11 ? id : null;
    }

    // youtube.com/watch?v=<id>
    if (url.searchParams.has('v')) {
      const v = url.searchParams.get('v');
      if (v && idLike.test(v)) return v;
    }

    // youtube.com/shorts/<id>
    const parts = url.pathname.split('/').filter(Boolean);
    const shortsIndex = parts.indexOf('shorts');
    if (shortsIndex !== -1 && parts[shortsIndex + 1]) {
      const id = parts[shortsIndex + 1];
      return idLike.test(id) ? id : null;
    }

    // youtube.com/embed/<id>
    const embedIndex = parts.indexOf('embed');
    if (embedIndex !== -1 && parts[embedIndex + 1]) {
      const id = parts[embedIndex + 1];
      return idLike.test(id) ? id : null;
    }

    return null;
  } catch {
    return null;
  }
}

function buildEmbedUrl(videoId: string | null): string | null {
  if (!videoId) return null;
  const params = new URLSearchParams({
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
    controls: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

const DEFAULT_URL = 'https://youtube.com/shorts/0DowVODVnJc?si=J72i9jj4PMBRDVY2';

export default function HomePage() {
  const [input, setInput] = useState<string>(DEFAULT_URL);
  const [committed, setCommitted] = useState<string>(DEFAULT_URL);

  useEffect(() => {
    // If arriving with ?url= param, hydrate from it
    const search = new URLSearchParams(window.location.search);
    const urlParam = search.get('url');
    if (urlParam) {
      setInput(urlParam);
      setCommitted(urlParam);
    }
  }, []);

  const videoId = useMemo(() => extractYouTubeId(committed), [committed]);
  const embedUrl = useMemo(() => buildEmbedUrl(videoId), [videoId]);

  const shareUrl = useMemo(() => {
    const u = new URL(window.location.href);
    u.searchParams.set('url', committed);
    return u.toString();
  }, [committed]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCommitted(input);
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore copy failure
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">YouTube Shorts Viewer</h1>
        <p className="text-sm text-gray-400 mt-2">Paste any YouTube link (shorts, watch, youtu.be) to embed it.</p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
        <input
          aria-label="YouTube URL"
          className="flex-1 rounded-md border border-gray-800 bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="https://youtube.com/shorts/... or https://youtube.com/watch?v=..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-brand-500 px-5 py-3 text-sm font-medium hover:opacity-90 transition"
        >
          Embed
        </button>
      </form>

      {!videoId && (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-sm text-gray-300">
          Enter a valid YouTube link or 11-character video ID.
        </div>
      )}

      {embedUrl && (
        <section className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-800 bg-black">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="truncate text-sm text-gray-300">
              Share this page with your link embedded:
              <div className="truncate text-gray-100">{shareUrl}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => copy(shareUrl)} className="rounded-md border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800">Copy Page URL</button>
              <button onClick={() => copy(embedUrl)} className="rounded-md border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800">Copy Embed URL</button>
            </div>
          </div>
        </section>
      )}

      <footer className="mt-10 text-xs text-gray-500">
        Not affiliated with YouTube. All content belongs to its respective owners.
      </footer>
    </main>
  );
}
