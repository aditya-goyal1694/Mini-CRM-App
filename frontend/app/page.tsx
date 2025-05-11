"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-6 pt-14 pb-24">
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-8 shadow-xl flex flex-col gap-6 items-center">
        <span className="text-5xl mb-2">🚀</span>
        <h1 className="text-4xl font-extrabold text-indigo-800 text-center mb-2">
          MiniCRM <span className="text-indigo-500">Platform</span>
        </h1>
        <p className="text-center text-lg text-gray-700 max-w-2xl font-medium">
          Segment your audiences, deliver personalized campaigns, and unlock AI-powered insights—all from a single, intuitive dashboard. <br />
          Start engaging smarter, now.
        </p>
        <div className="flex gap-4 mt-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg text-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
          >
            Login with Google
          </Link>
          <Link
            href="/campaigns"
            className="px-6 py-3 rounded-lg text-lg bg-white border border-indigo-600 text-indigo-700 font-semibold shadow hover:bg-indigo-600 hover:text-white transition"
          >
            View Campaigns
          </Link>
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full justify-center text-center">
          <Card
            icon="🧑‍💼"
            title="Dynamic Segmentation"
            desc="Powerful rule builder to create audience segments with flexible AND/OR conditions."
          />
          <Card
            icon="🤖"
            title="AI Message Suggestions"
            desc="Get AI-powered message ideas tailored to your campaign goals."
          />
          <Card
            icon="📈"
            title="Live Delivery Stats"
            desc="Track deliveries and failures, see your impact immediately."
          />
        </div>
      </section>
      <section className="mt-12 text-gray-700 text-center space-y-4">
        <h2 className="text-lg font-semibold text-indigo-800">How it works:</h2>
        <ol className="list-decimal list-inside inline-block text-left font-medium">
          <li>
            <span className="font-bold text-indigo-700">Ingest customer & order data</span> via secure REST APIs
          </li>
          <li>
            <span className="font-bold text-indigo-700">Define your audience</span> with our intuitive rule builder
          </li>
          <li>
            <span className="font-bold text-indigo-700">Launch personalized campaigns</span> with a click
          </li>
          <li>
            <span className="font-bold text-indigo-700">Monitor delivery results</span> and get actionable insights
          </li>
          <li>
            <span className="font-bold text-indigo-700">Let AI power your next step</span> with smart suggestions!
          </li>
        </ol>
      </section>
      <section className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-block bg-purple-100 text-purple-900 px-6 py-3 rounded-lg shadow transition font-semibold hover:bg-purple-200"
        >
          Contact & Support
        </Link>
      </section>
    </main>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="flex-1 min-w-[240px] bg-white rounded-2xl shadow p-5 flex flex-col items-center border border-gray-100">
      <span className="text-3xl mb-2">{icon}</span>
      <div className="font-bold text-lg mb-1 text-indigo-800">{title}</div>
      <div className="text-gray-600 text-center">{desc}</div>
    </div>
  );
}