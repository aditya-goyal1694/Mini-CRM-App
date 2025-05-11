"use client";
import { FaGithub, FaLinkedin, FaExternalLinkAlt, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-xl flex flex-col gap-4 items-center border border-gray-100">
        <div className="text-3xl font-extrabold text-indigo-700 mb-1">Contact</div>
        <div className="text-lg text-gray-600 font-medium mb-3 text-center">
          Built with ❤️ by <span className="font-bold text-indigo-700">Aditya Goyal</span>
        </div>
        {/* Portfolio */}
        <ContactRow
          href="https://port-folio-two-flame.vercel.app/"
          label="Portfolio"
          Icon={FaExternalLinkAlt}
        />
        {/* Github */}
        <ContactRow
          href="https://github.com/aditya-goyal1694"
          label="GitHub"
          Icon={FaGithub}
        />
        {/* LinkedIn */}
        <ContactRow
          href="https://www.linkedin.com/in/aditya-goyal18/"
          label="LinkedIn"
          Icon={FaLinkedin}
        />
        {/* Email */}
        <ContactRow
          href="mailto:adityamr.1694@gmail.com"
          label="adityamr.1694@gmail.com"
          Icon={FaEnvelope}
        />
      </div>
    </main>
  );
}

function ContactRow({ href, label, Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 w-full bg-indigo-50 hover:bg-indigo-100 transition px-4 py-3 rounded-xl mb-1"
    >
      <Icon className="text-indigo-700 text-xl" />
      <span className="text-gray-800 font-semibold">{label}</span>
    </a>
  );
}