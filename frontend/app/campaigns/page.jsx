"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://crm-backend-ycfo.onrender.com/api/campaigns", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setCampaigns(sorted);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 py-8 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-gray-900">📊 Campaign History</h2>
        {/* Refresh button */}
        <button
          onClick={fetchCampaigns}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mb-4">
        <span className="text-xs text-gray-500">
          Stats update shortly after campaign creation. Click &quot;Refresh&quot; to see the latest.
        </span>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-gray-500 italic">No campaigns found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Audience Size</th>
                <th className="px-6 py-3 font-semibold">Delivered</th>
                <th className="px-6 py-3 font-semibold">Failed</th>
                <th className="px-6 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">{c.name}</td>
                  <td className="px-6 py-3">{c.audience_size}</td>
                  <td className="px-6 py-3">{c.sent_count ?? "-"}</td>
                  <td className="px-6 py-3">{c.failed_count ?? "-"}</td>
                  <td className="px-6 py-3">{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-right">
        <Link
          href="/create-campaign"
          className="inline-block bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Create New Campaign
        </Link>
      </div>
    </div>
  );
}