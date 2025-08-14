import { LoginArea } from '@/components/auth/LoginArea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Github } from 'lucide-react';

interface HeaderProps {
  title?: string;
  className?: string;
}

export function Header({ 
  title,
  className = ""
}: HeaderProps) {
  return (
    <div className={`border-b bg-white dark:bg-gray-800 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Articles</h1>
              <p className="text-sm text-muted-foreground">By <a href="https://nostr.buzz" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">Nostr.Buzz</a></p>
            </div>
            {title && (
              <div className="border-l pl-4 ml-2">
                <h2 className="text-lg font-medium">{title}</h2>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/nostr-buzz/nostr-articles"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Github className="h-[1.2rem] w-[1.2rem]" />
            </a>
            <ThemeToggle />
            <LoginArea className="max-w-60" />
          </div>
        </div>
      </div>
    </div>
  );
}