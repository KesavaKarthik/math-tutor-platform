/** Chapter title banner above the two mode cards. */
export default function ChapterHero({ name }: { name: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
        {name}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
        Choose how you want to interact with this chapter. You can either read through the raw concepts or practice with the Socratic AI Tutor.
      </p>
    </div>
  );
}
