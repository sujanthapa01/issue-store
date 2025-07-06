'use client';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Feed from '@/components/feed/page';

interface FeedType {
  id: string;
  name: string;
  owner: string;
  fullName: string;
  url: string;
}

function Page() {
  const [data, setData] = useState<FeedType[]>([]);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const feed = useCallback(async () => {
    setLoading(true);
    try {
      // Uncomment if you want to fetch feed data
      // const response = await axios.get("/api/feed")
      // setData(response.data?.feed || [])

      // Read username from localStorage safely
      const name = localStorage.getItem('github_username');
      const avatar_url = localStorage.getItem('avatar_url');
      setAvatar(avatar_url);
      setUsername(name);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    feed();
  }, [feed]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Top-right profile */}
      <div className="w-full flex justify-end items-center p-4 fixed top-0 right-0 z-30">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-4 py-2 flex items-center gap-2 shadow-lg">
          {username ? (
            <a
              href={`/profile/${username}`}
              className="flex items-center gap-2 hover:underline hover:brightness-110 transition duration-200"
            >
              <img
                src={
                  avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    username,
                  )}&background=4A90E2&color=fff&size=40`
                }
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border border-white/50"
              />
              <span className="text-white font-semibold">{username}</span>
            </a>
          ) : (
            <span className="text-white font-semibold">Profile</span>
          )}
        </div>
      </div>

      {/* Background SVG - fixed full screen, full opacity */}
      <div
        className="fixed inset-0 bg-cover bg-no-repeat bg-center opacity-80 -z-0"
        style={{ backgroundImage: "url('/stacked-peaks-haikei.svg')" }}
      />

      {/* Fixed glassmorphism container */}
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl p-6 overflow-y-auto max-h-[100vh] scrollbar-none">
        {loading && <p className="text-center mb-4">Loading...</p>}
        {error && <p className="text-center mb-4 text-red-400">Error loading feed</p>}

        <Feed />
      </div>
    </div>
  );
}

export default Page;
