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

  // Helper: Convert rules & logic to backend's JSON structure
  const buildRuleTree = () => {
    return {
      [logicType]: rules.map((r) => ({
        field: r.field,
        operator: r.operator,
        value: r.field === "inactive_days" ? Number(r.value) : Number(r.value),
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
      // Redirect after save:
      setTimeout(() => {
        window.location.href = "/campaigns";
      }, 1000);
    } catch (err) {
      setSaving(false);
      setMessage("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Campaign</h2>
      <div className="mb-3">
        <label className="block font-medium mb-1">Campaign Name</label>
        <input
          className="w-full border p-2 rounded"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Segment Logic</label>
        <select
          className="border p-2 rounded mr-2"
          value={logicType}
          onChange={(e) => setLogicType(e.target.value)}
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
        <span className="text-sm text-gray-500">
          (Combine rules with <span className="font-bold">{logicType.toUpperCase()}</span>)
        </span>
      </div>
      {rules.map((rule, idx) => (
        <div key={idx} className="flex gap-2 mb-2 items-center">
          <select
            className="border p-2 rounded"
            value={rule.field}
            onChange={(e) => handleRuleChange(idx, "field", e.target.value)}
          >
            {fields.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={rule.operator}
            onChange={(e) => handleRuleChange(idx, "operator", e.target.value)}
          >
            {operators.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
          <input
            className="border p-2 rounded w-28"
            type="number"
            value={rule.value}
            onChange={(e) => handleRuleChange(idx, "value", e.target.value)}
            placeholder="Value"
          />
          {rules.length > 1 &&
            <button
              type="button"
              className="text-red-600"
              onClick={() => removeRule(idx)}
            >Remove</button>
          }
        </div>
      ))}
      <button
        type="button"
        className="mb-3 px-3 py-2 bg-blue-100 border border-blue-400 rounded text-sm"
        onClick={addRule}
      >+ Add Rule</button>

      <div className="mb-3">
        <button
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded mr-3"
          onClick={handlePreview}
        >Preview Audience</button>
        {audienceSize !== null && (
          <span className="ml-3 text-green-700 font-semibold">
            Audience Size: {audienceSize}
          </span>
        )}
      </div>

      <button
        className="bg-green-600 text-white px-5 py-2 rounded"
        disabled={!campaignName || rules.some(r => !r.value)}
        onClick={handleSave}
      >
        {saving ? "Saving..." : "Save Campaign"}
      </button>
      {message && (
        <div className="mt-2 text-sm text-red-500">{message}</div>
      )}
    </div>
  );
}

export default CreateCampaign;