const { Op } = require('sequelize');

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

  // Handle logical operators (and/or), recurse for nested logic
  if (rule.and || rule.or) {
    const logic = rule.and ? 'and' : 'or';
    return {
      [logic === 'and' ? Op.and : Op.or]: (rule[logic] || []).map(sequelizeRules),
    };
  }

  // Leaf: single condition or special case
  if (rule.field && rule.operator && rule.value !== undefined) {
    if (rule.field === 'inactive_days') {
      // Transform "inactive for N days" into last_purchase_date check
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - rule.value);
      return { last_purchase_date: { [Op.lt]: cutoffDate } };
    }
    return {
      [rule.field]: { [opMap[rule.operator]]: rule.value },
    };
  }

  return {};
}

module.exports = sequelizeRules;