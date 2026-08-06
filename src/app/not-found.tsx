import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-surface">
      <span className="text-8xl mb-4">🥩</span>
      <h1 className="font-heading text-4xl font-bold text-ink mb-2">404 — Page Not Found</h1>
      <p className="text-ink-muted mb-8 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
}
