"use client"
import React, { useState } from "react";
import axios from "axios";

const fields = [
  { label: "Total Spend (₹)", value: "total_spend" },
  { label: "Visits", value: "visits" },
  { label: "Inactive Days", value: "inactive_days" },
];

const operators = [
  { label: ">", value: ">" },
  { label: "<", value: "<" },
  { label: ">=", value: ">=" },
  { label: "<=", value: "<=" },
  { label: "=", value: "=" },
  { label: "!=", value: "!=" },
];

function CreateCampaign() {
  const [campaignName, setCampaignName] = useState("");
  const [rules, setRules] = useState([
    { field: "total_spend", operator: ">", value: "" },
  ]);
  const [logicType, setLogicType] = useState("and");
  const [audienceSize, setAudienceSize] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [objective, setObjective] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleRuleChange = (idx, key, value) => {
    const updated = [...rules];
    updated[idx][key] = value;
    setRules(updated);
  };

  const addRule = () => {
    setRules([...rules, { field: "total_spend", operator: ">", value: "" }]);
  };

  const removeRule = (idx) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  const buildRuleTree = () => {
    return {
      [logicType]: rules.map((r) => ({
        field: r.field,
        operator: r.operator,
        value: Number(r.value),
      })),
    };
  };

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
    },
  });

  const handlePreview = async () => {
    try {
      setAudienceSize(null);
      setMessage("");
      const ruleTree = buildRuleTree();
      const res = await axios.post(
        "/api/segments/preview",
        { rule: ruleTree },
        getAuthHeader()
      );
      setAudienceSize(res.data.audience_size);
    } catch (err) {
      setMessage("Preview failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const ruleTree = buildRuleTree();
      await axios.post(
        "/api/campaigns",
        {
          name: campaignName,
          rule: ruleTree,
        },
        getAuthHeader()
      );
      setSaving(false);
      setMessage("Campaign saved!");
      setTimeout(() => {
        window.location.href = "/campaigns";
      }, 1000);
    } catch (err) {
      setSaving(false);
      setMessage("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Create Campaign</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1 text-gray-800">Campaign Name</label>
        <input
          className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder:text-gray-800"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Enter campaign name"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1 text-gray-800">Segment Logic</label>
        <select
          className="border border-gray-300 p-2 rounded mr-2 text-gray-800"
          value={logicType}
          onChange={(e) => setLogicType(e.target.value)}
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
        <span className="text-sm text-gray-700">
          (Combine rules with <span className="font-bold">{logicType.toUpperCase()}</span>)
        </span>
      </div>

      {rules.map((rule, idx) => (
        <div key={idx} className="flex flex-wrap gap-2 mb-2 items-center">
          <select
            className="border border-gray-300 p-2 rounded text-gray-800"
            value={rule.field}
            onChange={(e) => handleRuleChange(idx, "field", e.target.value)}
          >
            {fields.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-2 rounded text-gray-800"
            value={rule.operator}
            onChange={(e) => handleRuleChange(idx, "operator", e.target.value)}
          >
            {operators.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
          <input
            className="border border-gray-300 p-2 rounded w-28 text-gray-800 placeholder:text-gray-800"
            type="number"
            value={rule.value}
            onChange={(e) => handleRuleChange(idx, "value", e.target.value)}
            placeholder="Value"
          />
          {rules.length > 1 &&
            <button
              type="button"
              className="text-red-600 text-sm"
              onClick={() => removeRule(idx)}
            >Remove</button>
          }
        </div>
      ))}

      <button
        type="button"
        className="mb-4 px-3 py-2 bg-blue-100 border border-blue-400 rounded text-sm text-gray-800"
        onClick={addRule}
      >
        + Add Rule
      </button>

      <div className="mb-4">
        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mr-3"
          onClick={handlePreview}
        >
          Preview Audience
        </button>
        {audienceSize !== null && (
          <span className="ml-3 text-green-700 font-semibold">
            Audience Size: {audienceSize}
          </span>
        )}
      </div>

      <button
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
        disabled={!campaignName || rules.some(r => !r.value)}
        onClick={handleSave}
      >
        {saving ? "Saving..." : "Save Campaign"}
      </button>

      {message && (
        <div className="mt-3 text-sm text-red-600">{message}</div>
      )}

      <div className="mt-6 mb-4">
        <label className="block font-medium mb-1 text-gray-800">
          Campaign Objective (for AI suggestions)
        </label>
        <input
          className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder:text-gray-800"
          type="text"
          value={objective}
          onChange={e => setObjective(e.target.value)}
          placeholder="E.g., Bring back inactive users..."
        />
        <button
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={!objective}
          onClick={async () => {
            setAiLoading(true); setAiError(''); setAiSuggestions([]);
            try {
              const res = await axios.post(
                "/api/ai/suggest-messages",
                { objective },
                {
                  headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` }
                }
              );
              setAiSuggestions(res.data.suggestions);
            } catch (e) {
              setAiError("AI failed to suggest: " + (e.response?.data?.error || e.message));
            } finally {
              setAiLoading(false);
            }
          }}
        >
          {aiLoading ? "Generating..." : "Suggest Messages"}
        </button>
        {aiError && <div className="mt-2 text-sm text-red-600">{aiError}</div>}
        {aiSuggestions.length > 0 && (
          <ul className="mt-2 bg-gray-100 rounded p-3 text-gray-800">
            {aiSuggestions.map((s, i) => (
              <li key={i} className="mb-2">{s}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CreateCampaign;
