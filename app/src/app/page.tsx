import { NFTForm } from '@/components/NFTForm';

export default function Home() {
  return (
    <main className="min-h-screen p-8"> {/* Ensure your main element has any required classes */}
      <NFTForm />
    </main>
  );
}