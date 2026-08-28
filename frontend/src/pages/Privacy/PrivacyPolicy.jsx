import { Bell, LockKeyhole, UserRound } from "lucide-react";

const PrivacyPolicy = () => (
  <main className="min-h-screen bg-[#080a0f] text-white">
    <section className="container mx-auto max-w-4xl px-4 py-20 sm:py-28">
      <p className="mb-4 text-sm font-bold uppercase tracking-[.22em] text-red-500">
        Your privacy
      </p>
      <h1 className="text-4xl font-bold sm:text-6xl">Privacy Policy</h1>
      <p className="mt-5 text-sm text-[#737d91]">
        Last updated: August 28, 2026
      </p>
      <p className="mt-8 max-w-3xl text-lg leading-8 text-[#a8b0c0]">
        We collect a small amount of information, such as your name and email
        address, so we can manage your account and send you relevant updates
        about movies, articles, reviews, and MovieHaat news.
      </p>
      <div className="mt-12 space-y-5">
        <article className="rounded-2xl border border-white/10 bg-white/[.04] p-7">
          <div className="flex items-center gap-3">
            <UserRound className="text-red-500" />
            <h2 className="text-xl font-semibold">Information we collect</h2>
          </div>
          <p className="mt-4 leading-7 text-[#a8b0c0]">
            When you create an account, subscribe, or contact us, we may collect
            your name, email address, account details, and the message you send
            us. We may also collect basic technical information needed to keep
            the website secure and working correctly.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[.04] p-7">
          <div className="flex items-center gap-3">
            <Bell className="text-red-500" />
            <h2 className="text-xl font-semibold">How we use it</h2>
          </div>
          <p className="mt-4 leading-7 text-[#a8b0c0]">
            We use this information to provide your account, respond to
            requests, improve MovieHaat, and share movie-related updates that
            may interest you. You can ask us to stop promotional emails at any
            time.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[.04] p-7">
          <div className="flex items-center gap-3">
            <LockKeyhole className="text-red-500" />
            <h2 className="text-xl font-semibold">How we protect it</h2>
          </div>
          <p className="mt-4 leading-7 text-[#a8b0c0]">
            We use reasonable safeguards and do not sell your personal
            information. We keep it only as long as needed for the purposes
            described here or to meet legal requirements.
          </p>
        </article>
      </div>
    </section>
  </main>
);

export default PrivacyPolicy;
