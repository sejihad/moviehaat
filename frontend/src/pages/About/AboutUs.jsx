import { BookOpen, Clapperboard, Search } from "lucide-react";

const AboutUs = () => (
  <main className="min-h-screen bg-[#080a0f] text-white">
    <section className="container mx-auto max-w-5xl px-4 py-20 sm:py-28">
      <p className="mb-4 text-sm font-bold uppercase tracking-[.22em] text-red-500">
        About MovieHaat
      </p>
      <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
        We write about movies.
      </h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-[#a8b0c0]">
        MovieHaat is an editorial website for people who love cinema. We publish
        movie articles, reviews, recommendations, release updates, cast and crew
        information, and stories from the film world.
      </p>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/[.04] p-7">
          <BookOpen className="mb-5 text-red-500" />
          <h2 className="text-xl font-semibold">Articles & reviews</h2>
          <p className="mt-3 leading-7 text-[#929bad]">
            Thoughtful writing that helps readers discover and understand films.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[.04] p-7">
          <Search className="mb-5 text-red-500" />
          <h2 className="text-xl font-semibold">Movie information</h2>
          <p className="mt-3 leading-7 text-[#929bad]">
            Useful details, release news, recommendations, and cinema updates.
          </p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/[.04] p-7">
          <Clapperboard className="mb-5 text-red-500" />
          <h2 className="text-xl font-semibold">Editorial only</h2>
          <p className="mt-3 leading-7 text-[#929bad]">
            We do not stream, host, upload, or distribute movies on MovieHaat.
          </p>
        </article>
      </div>
      <div className="mt-12 rounded-2xl border border-red-500/25 bg-red-500/[.07] p-7 sm:p-9">
        <h2 className="text-2xl font-semibold">Our purpose</h2>
        <p className="mt-3 max-w-3xl leading-8 text-[#b5bdca]">
          Our goal is to keep movie lovers informed through original editorial
          content. Movie names, posters, and related details are used for
          information, commentary, and discovery—not to provide the movie
          itself.
        </p>
      </div>
    </section>
  </main>
);

export default AboutUs;
