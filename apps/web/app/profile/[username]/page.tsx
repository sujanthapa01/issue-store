'use client';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import RepositoryPopup from '@/components/repositoryPopup/page';
import SavedRepositoriesPopup from '@/components/savedRepositories/page';
import { useRouter } from 'next/navigation';

const Page = () => {
  const params = useParams();
  const usernameParam = params.username || '';

  const [email, setEmail] = useState<string | null>('');
  const [username, setUsername] = useState<string | null>('');
  const [avatar_url, setAvatar] = useState<string | null>('');
  const [userNotFound, setUserNotFound] = useState(false);

  const router = useRouter();

  const fetchUser = useCallback(async () => {
    if (!usernameParam) return;

    try {
      const res = await axios.post('/api/user/me', { username: usernameParam });
      if (res.data.ok === true && res.data.user) {
        setEmail(res.data.user.email);
        setUsername(res.data.user.username);
        setAvatar(res.data.user.avatar);
        setUserNotFound(false);
      } else {
        setUserNotFound(true);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUserNotFound(true);
    }
  }, [usernameParam]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (userNotFound) {
    return (
      <div className="flex justify-center items-center h-screen text-black">
        <h1>User not found</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex justify-center items-center text-black flex-col overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url('/stacked-peaks-haikei.svg')" }}
      />

      <div className="mt-14 px-10 py-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center gap-3 min-[433px]:gap-6 max-w-md w-[90%]">
        <img
          src={avatar_url || undefined}
          alt="avatar"
          className="h-[200px] w-[200px] rounded-xl border border-white/30 object-cover"
        />
        <p className="text-3xl font-bold text-white">{username}</p>
        <p className="text-white/80 min-[433px]:text-sm text-xs">Email - {email}</p>

        <section className="mt-6 flex  gap-4 md:flex-nowrap flex-wrap justify-center">
          <RepositoryPopup username={username} />
          <SavedRepositoriesPopup />
        </section>

        <button onClick={() => router.push('/')} className="cursor-pointer text-white">{`< back`}</button>
      </div>
    </div>
  );
};

export default Page;
