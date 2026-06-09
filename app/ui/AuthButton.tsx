'use client';
import { createClient } from '@/utils/supabase/client';
import { FaGoogle, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AuthButton({ user }: { user: any }) {
  const supabase = createClient();
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (user) {
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
    const userAvatar = user?.user_metadata?.avatar_url;

    return (
      <div className="flex items-center gap-3 bg-[#141e0f]/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-md">
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName}
            className="w-8 h-8 rounded-full border border-[#a3e635]/30 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-olive-green/30 border border-white/10 flex items-center justify-center font-bold text-[#a3e635] text-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-bold text-foreground max-w-[120px] truncate">{userName}</span>
        
        <div className="h-4 w-[1px] bg-white/10 mx-1" />

        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="p-1.5 rounded-full hover:bg-white/10 text-foreground/70 hover:text-red-400 transition-colors cursor-pointer"
        >
          <span className="sr-only">Sign Out</span>
          <FaSignOutAlt className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3F5426]/20 border border-[#3F5426]/40 text-[#fdfbf7] hover:bg-[#3F5426]/40 hover:border-[#3F5426]/60 hover:shadow-[0_0_15px_rgba(63,84,38,0.4)] transition-all font-semibold shadow-md active:scale-[0.98] cursor-pointer text-sm"
    >
      <FaGoogle className="w-4 h-4 text-[#a3e635]" />
      <span>Sign in with Google</span>
    </button>
  );
}
