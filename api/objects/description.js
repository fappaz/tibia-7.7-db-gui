import i18n from "../i18n";

export function getItemDescription(item) {
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
  const expireDescription = Object.entries(supportedExpireAttributes).map(([attribute, { getText }]) => {
    const value = item.attributes[attribute];
    if (!value) return;
    if (value) return getText(value);
  }).filter(Boolean)[0] || '';

  /** @TODO (future) add description once rune texts are figured out */
  const runeDescription = ``;

  const supportedRequirementAttributes = {
    MinimumLevel: { getText: (value) => value },
    Professions: { getText: (value) => i18n.t(`items.attributes.Professions.values.${value}`) },
  };
  const requirementText = (item.attributes.MinimumLevel || item.attributes.Professions) ? `It can only be wielded by ${supportedRequirementAttributes.Professions.getText(item.attributes.Professions).toLocaleLowerCase()}s of level ${supportedRequirementAttributes.MinimumLevel.getText(item.attributes.MinimumLevel)} or higher.` : '';

  // get the item.weight, divide by 100, and make sure it has 2 decimal places
  const weight = (item.attributes.Weight / 100).toFixed(2);
  const weightText = weight ? `It weighs ${weight} oz.` : '';

  const lines = [
    `You see ${item.article} ${item.name}${bonusText}${expireDescription}.${runeDescription}`,
    requirementText, // It can only be wielded by ${vocation} of level ${minLevel} or higher.
    weightText,
    item.description,
  ].filter(Boolean);
  
  return lines.join('\n');
}