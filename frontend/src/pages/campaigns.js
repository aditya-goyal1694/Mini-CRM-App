import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await axios.get("/api/campaigns");
        setCampaigns(res.data);
      } catch (err) {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Campaign History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-gray-500">No campaigns found.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Audience Size</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.audience_size}</td>
                <td className="px-4 py-2">{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4">
        <a
          href="/create-campaign"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Create New Campaign
        </a>
      </div>
    </div>
  );
}