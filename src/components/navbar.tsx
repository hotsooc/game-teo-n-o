import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-200 to-gray-300 p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl text-shadow font-bold">Hero&apos;s Land - XHCN Guild - Asia(Sea)</h1>
        <div className="space-x-4 font-bold">
          <Link href="/" className="hover:underline">Teammate</Link>
          <Link href="/role" className="hover:underline">Role</Link>
          <Link href="/content" className="hover:underline">Content</Link>
        </div>
      </div>
    </nav>
  );
}