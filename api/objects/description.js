import i18n from "../i18n";

export function getItemDescription(item) {
  const articleText = `${item.article || ''} `;

  const supportedBonusAttributes = {
    WeaponAttackValue: { getText: (value) => `Atk:${value}` },
    WeaponDefendValue: { getText: (value) => `Def:${value}` },
    ArmorValue: { getText: (value) => `Arm:${value}` },
    Capacity: { getText: (value) => `Vol:${value}` },
    ShieldDefendValue: { getText: (value) => `Def:${value}` },
  };
  const bonuses = Object.entries(supportedBonusAttributes).map(([attribute, { getText }]) => {
    const value = item.attributes[attribute];
    if (!value) return;
    if (value) return getText(value);
  }).filter(Boolean);
  const bonusText = bonuses.length ? ` (${bonuses.join(' ')})` : '';

  const supportedExpireAttributes = {
    // TotalExpireTime: { getText: (value) => ` that has energy for ${value / 60} minutes left` },
    TotalExpireTime: { getText: (value) => ` that is brand-new` },
    TotalUses: { getText: (value) => ` that has ${value} charges left` },
  };
  let expireDescription = Object.entries(supportedExpireAttributes).map(([attribute, { getText }]) => {
    const value = item.attributes[attribute];
    if (!value) return;
    if (value) return getText(value);
  }).filter(Boolean)[0] || '';
  if (item.attributes.CorpseType) expireDescription = '';

  /** @TODO (future) add description once rune texts are figured out */
  const runeDescription = ``;

  const supportedRequirementAttributes = {
    MinimumLevel: { getText: (value) => value },
    Professions: { getText: (value) => i18n.t(`items.attributes.Professions.values.${value}`) },
  };
  const requirementText = (item.attributes.MinimumLevel || item.attributes.Professions) ? `It can only be wielded by ${supportedRequirementAttributes.Professions.getText(item.attributes.Professions).toLocaleLowerCase()}s of level ${supportedRequirementAttributes.MinimumLevel.getText(item.attributes.MinimumLevel)} or higher.` : '';

  // get the item.weight, divide by 100, and make sure it has 2 decimal places
  const weightText = item.attributes.Weight ? `It weighs ${((item.attributes.Weight || 0) / 100).toFixed(2)} oz.` : '';

  const itemDescription = item.description || '';
  const itemDescriptionText = itemDescription ? `${itemDescription}.` : '';

  const lines = [
    `You see ${articleText}${item.name}${bonusText}${expireDescription}.${runeDescription}`,
    requirementText, // It can only be wielded by ${vocation} of level ${minLevel} or higher.
    weightText,
    itemDescriptionText,
  ].filter(Boolean);
  
  return lines.join('\n');
}