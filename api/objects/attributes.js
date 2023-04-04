export default {
  AbsTeleportEffect: { id: 'AbsTeleportEffect' },
  AmmoAttackValue: { id: 'AmmoAttackValue' },
  AmmoEffectStrength: { id: 'AmmoEffectStrength' },
  AmmoMissile: { id: 'AmmoMissile' },
  AmmoSpecialEffect: {
    id: 'AmmoSpecialEffect',
    values: {
      '1': 'Poison',
      '2': 'Fire',
    }
  },
  AmmoType: {
    id: 'AmmoType',
    values: {
      '1': 'Bolt',
      '2': 'Arrow',
    }
  },
  ArmorValue: { id: 'ArmorValue' },
  AvoidDamageTypes: { id: 'AvoidDamageTypes' },
  BodyPosition: {
    id: 'BodyPosition',
    values: {
      '0': 'Two handed',
      '1': 'Helmet',
      '2': 'Amulet',
      '3': 'Bag',
      '4': 'Armor',
      '7': 'Legs',
      '8': 'Boots',
      '9': 'Ring',
    }
  },
  BowAmmoType: {
    id: 'BowAmmoType',
    values: {
      '1': 'Bolt',
      '2': 'Arrow',
    }
  },
  BowRange: { id: 'BowRange' },
  Brightness: { id: 'Brightness' },
  Capacity: { id: 'Capacity' },
  ChangeTarget: { id: 'ChangeTarget' },
  CorpseType: { id: 'CorpseType' },
  DamageReduction: { id: 'DamageReduction' },
  DestroyTarget: { id: 'DestroyTarget' },
  DisguiseTarget: { id: 'DisguiseTarget' },
  Elevation: { id: 'Elevation' },
  ExpireTarget: { id: 'ExpireTarget' },
  FontSize: { id: 'FontSize' },
  InformationType: { id: 'InformationType' },
  KeydoorTarget: { id: 'KeydoorTarget' },
  LeveldoorTarget: { id: 'LeveldoorTarget' },
  LightColor: { id: 'LightColor' },
  MaxLength: { id: 'MaxLength' },
  MaxLengthOnce: { id: 'MaxLengthOnce' },
  Meaning: { id: 'Meaning' },
  MinimumLevel: { id: 'MinimumLevel' },
  NamedoorTarget: { id: 'NamedoorTarget' },
  Nutrition: { id: 'Nutrition' },
  Professions: {
    id: 'Professions',
    /** The values are bit flags */
    values: {
      '1': 'no vocation',
      '2': 'knight',
      '4': 'paladin',
      '8': 'sorcerer',
      '16': 'druid',
    }
  },
  ProtectionDamageTypes: {
    id: 'ProtectionDamageTypes',
    values: {
      '2': 'Poison',
      '4': 'Fire',
      '8': 'Energy',
      '17': 'Physical',
      '256': 'Life drain',
      '287': 'Fire, Energy, Earth, Ice, Holy, Death, Physical',
      '512': 'Mana drain',
    }
  },
  QuestdoorTarget: { id: 'QuestdoorTarget' },
  RelTeleportDisplacement: { id: 'RelTeleportDisplacement' },
  RelTeleportEffect: { id: 'RelTeleportEffect' },
  RotateTarget: { id: 'RotateTarget' },
  ShieldDefendValue: { id: 'ShieldDefendValue' },
  SkillModification: { id: 'SkillModification' },
  SkillNumber: {
    id: 'SkillNumber',
    /**
     * Values 12, 15, 17, 18, 19, 23 and 24 are missing.
     * Some of them are conditions, such as "Poisoning", "Burning", "Electrified" (and "light"?) - see https://otland.net/threads/7-7-realots-7-7-cipsoft-files-virgin.244562/page-59#post-2707667
     */
    values: {
      '0': 'Experience',
      '1': 'Magic level',
      '2': 'Health',
      '3': 'Mana',
      '4': 'Move speed',
      '5': 'Capacity',
      '6': 'Shielding',
      '7': 'Distance fighting',
      '8': 'Sword fighting',
      '9': 'Club fighting',
      '10': 'Axe fighting',
      '11': 'Fist fighting',
      '14': 'Regeneration',
      '16': 'Stealth', // maybe Illusion is the proper term
      '20': 'Anti-drunk',
      '21': 'Mana shield',
      '22': 'Soul',
    }
  },
  SourceLiquidType: { id: 'SourceLiquidType' },
  ThrowAttackValue: { id: 'ThrowAttackValue' },
  ThrowDefendValue: { id: 'ThrowDefendValue' },
  ThrowEffectStrength: { id: 'ThrowEffectStrength' },
  ThrowFragility: { id: 'ThrowFragility' },
  ThrowMissile: { id: 'ThrowMissile' },
  ThrowRange: { id: 'ThrowRange' },
  ThrowSpecialEffect: { id: 'ThrowSpecialEffect' },
  TotalExpireTime: { id: 'TotalExpireTime' },
  TotalUses: { id: 'TotalUses' },
  WandAttackStrength: { id: 'WandAttackStrength' },
  WandAttackVariation: { id: 'WandAttackVariation' },
  WandDamageType: {
    id: 'WandDamageType',
    values: {
      '2': 'Earth',
      '4': 'Fire',
      '8': 'Energy',
    }
  },
  WandManaConsumption: { id: 'WandManaConsumption' },
  WandMissile: { id: 'WandMissile' },
  WandRange: { id: 'WandRange' },
  Waypoints: { id: 'Waypoints' },
  WeaponAttackValue: { id: 'WeaponAttackValue' },
  WeaponDefendValue: { id: 'WeaponDefendValue' },
  WeaponType: {
    id: 'WeaponType',
    values: {
      '1': 'Sword',
      '2': 'Club',
      '3': 'Axe',
    }
  },
  WearoutTarget: { id: 'WearoutTarget' },
  Weigh: { id: 'Weight' },
}
