import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Team App</h1>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/role" className="hover:underline">Role</Link>
          <Link href="/content" className="hover:underline">Content</Link>
        </div>
      </div>
    </nav>
  );
}