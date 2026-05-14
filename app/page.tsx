import ChatInterface from '@/components/ChatInterface';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <ErrorBoundary>
        <ChatInterface />
      </ErrorBoundary>
    </main>
  );
}
