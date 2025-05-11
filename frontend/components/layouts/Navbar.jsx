"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href) =>
    `px-3 py-2 rounded font-medium transition ${
      pathname === href
        ? "bg-indigo-100 text-indigo-700"
        : "text-gray-700 hover:text-indigo-600"
    }`;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 mb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo/Home */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-indigo-700 text-xl hover:text-indigo-900">
            <span>Xeno CRM</span>
          </Link>

          <div className="flex space-x-1 md:space-x-4">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/create-campaign" className={linkClass("/create-campaign")}>
              Create Campaign
            </Link>
            <Link href="/campaigns" className={linkClass("/campaigns")}>
              View Campaigns
            </Link>
            <Link href="/login" className={linkClass("/login")}>
              Login
            </Link>
            <Link href="/contact" className={linkClass("/contact")}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}