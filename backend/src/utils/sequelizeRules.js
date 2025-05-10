// src/utils/ruleToSequelize.js
/**
 * Converts our JSON rule format into Sequelize WHERE options.
 * Supported operators: >, >=, <, <=, =, !=
 * Supported logic: and, or (recursive)
 */
const { Op } = require('sequelize');

// Map our operator to Sequelize Op
const opMap = {
  '>': Op.gt,
  '>=': Op.gte,
  '<': Op.lt,
  '<=': Op.lte,
  '=': Op.eq,
  '!=': Op.ne,
};

function sequelizeRules(rule) {
  if (!rule) return {};

  if (rule.and || rule.or) {
    // Compound logic (recursive)
    const logic = rule.and ? 'and' : 'or';
    return {
      [logic === 'and' ? Op.and : Op.or]: (rule[logic] || []).map(sequelizeRules),
    };
  }

  // Base case: leaf node
  if (rule.field && rule.operator && rule.value !== undefined) {
    // Special handling for "inactive for N days"
    if (rule.field === 'inactive_days') {
      // Convert "inactive for N days" to last_purchase_date < NOW() - INTERVAL N DAY
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - rule.value);
      return { last_purchase_date: { [Op.lt]: cutoffDate } };
    }

    // Normal field
    return {
      [rule.field]: { [opMap[rule.operator]]: rule.value },
    };
  }
  return {};
}

module.exports = sequelizeRules;