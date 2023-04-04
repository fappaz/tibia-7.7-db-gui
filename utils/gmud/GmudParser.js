/**
A GMUD (Graphic Multi-User Dungeon) file is a Lua script that describes properties and behaviours of the different objects in the game.

----------------------
Example of data types:
----------------------
# int
39
-123945

# string
"dragon lord"
"#Y yelling"

# boolean
true
false

# variable / enum
Content
HitPoints
0-0-0-0


----------------------
Example of structures:
----------------------
# function call (?)
(39, 0-0-0-0)

# list of numbers
[32369,32241,7]

# list of non-numbers (objects, functions, strings, enums, etc)
# Note: if a list of numbers is found, eastring number means the ID of the object
{(19,1),(20,1),(21,1)}



--------------------
List of tokens:
--------------------

# INTEGER
(-?[\d][\d]*)

# STRING
(".+?[^\\]")

# BOOLEAN
(true|false)

# VARIABLE
(([A-Z]|[\d]+-[\w])[\w]*)

# ATTRIBUTION_SYMBOL
=
:

# OBJECT_SEPARATOR_SYMBOL
,

# PROPERTY_SEPARATOR
\s
\n

# FUNCTION_START / FUNCTION_END
\(
\)

# LIST_NUMBERS_START / LIST_NUMBERS_END
\[
\]

# LIST_OBJECTS_START / LIST_OBJECTS_END (list of non-numbers)
\{
\}

# COMMENT_SYMBOL
#

--------------------
List of expressions:
--------------------

# LIST_NUMBERS
LIST_NUMBERS_START INTEGER (OBJECT_SEPARATOR_SYMBOL INTEGER)* LIST_NUMBERS_END

# VALUE
(OBJECT | INTEGER | STRING | BOOLEAN | VARIABLE | LIST_NUMBERS | LIST_OBJECTS | FUNCTION)

# OBJECT
(INTEGER | STRING | VARIABLE) (PROPERTY_SEPARATOR VALUE)*

# FUNCTION
FUNCTION_START VALUE (OBJECT_SEPARATOR_SYMBOL VALUE)* FUNCTION_END

# LIST_OBJECTS
LIST_OBJECTS_START VALUE (OBJECT_SEPARATOR_SYMBOL VALUE)* LIST_OBJECTS_END

# ATTRIBUTION
VARIABLE ATTRIBUTION_SYMBOL VALUE

# ROOT_OBJECT
ATTRIBUTION (PROPERTY_SEPARATOR ATTRIBUTION)*

*/

const InputStream = require('./InputStream.js').InputStream;
const TokenStream = require('./TokenStream.js').TokenStream;

module.exports.parse = (rawGmudString) => {

  const charInputStream = InputStream(rawGmudString);
  const tokenStream = TokenStream(charInputStream);
  const object = ObjectParser(tokenStream);

  return object;
};

/**
 * A function to parse a TokenStream with valid GMUD tokens into a JavaScript object.
 * @param {TokenStream} input The TokenStream. 
 */
function ObjectParser(input) {
  // let properties = [];
  const tokens = [];
  while (!input.eof()) tokens.push(input.next());
  let tokenIndex = 0;

  return parse();
  function parse() {
    const gmudObject = {};
    const propertiesKeys = [];
    while (tokenIndex < tokens.length - 1) {
      const property = readProperty();
      Object.keys(property).map(propName => {
        const existing = propertiesKeys.reduce((total, key) => total + (key == propName), 0);
        let key = propName;
        if (existing > 0) key = propName + (existing + 1);
        gmudObject[key] = property[propName];
        propertiesKeys.push(propName);
      }, 0);
    }
    return gmudObject;
  }

  function readProperty() {
    const token1 = getCurrentToken();
    const token2 = tokens[tokenIndex + 1];
    let property = {};
    let key = 'id';
    let valueToken;

    if (isType(token2, 'ATTRIBUTION_SYMBOL')) {
      key = token1.value;
      skipToken(2); // skip first token (VARIABLE) and second token (ATTRIBUTION_SYMBOL)
      valueToken = getCurrentToken();
    } else {
      /**
       * It should fall here when the first token is the value and should be assigned to an id.
       * The second token should be read as a property
       */
      // skipToken();
      valueToken = token1;
    }
    let value = readValue(valueToken);
    property[key] = value;

    return property;
  }

  function readValue(token) {
    let value;
    if (isType(token, 'BOOLEAN', 'INTEGER', 'STRING', 'VARIABLE')) {
      value = token.value;
    }

    if (isType(token, 'LIST_NUMBERS_START')) {
      value = readNumbersList();
    }

    if (isType(token, 'FUNCTION_START')) {
      value = readFunction();
    }

    if (isType(token, 'LIST_OBJECTS_START')) {
      value = readObjectsList();
    }

    skipToken();
    return value;
  }

  function getCurrentToken() {
    return tokens[tokenIndex];
  }

  function skipToken(quantityToSkip = 1) {
    tokenIndex += quantityToSkip;
  }

  function readNumbersList() {
    const list = [];
    skipToken();
    while (!isType(getCurrentToken(), 'LIST_NUMBERS_END')) {
      readWhileTypes('OBJECT_SEPARATOR_SYMBOL');
      const token = getCurrentToken();
      if (isType(token, 'INTEGER')) list.push(token.value);
      skipToken();
    }
    return list;
  }
  // Guests = {"Dulia Shika","Dandi Doskonaly Knight","Sconio"}
  function readObjectsList() {
    const list = [];
    skipToken();
    // OBJECT_SEPARATOR = ,         PROPERTY_SEPARATOR: _
    while (!isType(getCurrentToken(), 'LIST_OBJECTS_END')) {
      readWhileTypes('OBJECT_SEPARATOR_SYMBOL');
      // let token1 = getCurrentToken();
      let object = {};
      while (!isType(getCurrentToken(), 'PROPERTY_SEPARATOR', 'LIST_OBJECTS_END', 'OBJECT_SEPARATOR_SYMBOL')) {
        // skipToken();
        // let token2 = getCurrentToken();
        property = readProperty();
        // object[property.name] = property[property.name];
        object = { ...object, ...property };
      }
      list.push(object);
    }
    return list;
  }

  function readFunction() {
    const functionCall = {};
    let argIndex = 0;
    skipToken();
    while (!isType(getCurrentToken(), 'FUNCTION_END')) {
      readWhileTypes('OBJECT_SEPARATOR_SYMBOL');
      functionCall[`arg${argIndex++}`] = readValue(getCurrentToken());
    }
    return functionCall;
  }

  function isType(token, ...types) {
    return !token || (' ' + types.join(' ') + ' ').indexOf(' ' + token.type + ' ') >= 0;
  }

  function readWhileTypes(...skippableTypes) {
    while (isType(getCurrentToken(), skippableTypes)) {
      skipToken();
    }
  }

}

/**
 * It copies the original GMUD list of objects, 
 * editing their attribute names and adding a unique object ID. 
 * @param {list} playerObjects the list of GMUD objects that will be parsed.
 * @param {int} initialObjectId a unique object ID that should be assigned to the first element. 
 * All others will have sequential ID based on this one. The default value is 1.
 */
module.exports.parseGmudMapObjectsToModelObjects = (playerObjects) => {
  const modelObjects = [];

  /**
   * @TODO (future) use constants from api/objects/attributes
   * Supported attributes:
      AbsTeleportDestination=-2010517994
      Amount=3
      Charges=5
      ChestQuestNumber=110
      ContainerLiquidType=9
      DoorQuestNumber=64
      DoorQuestValue=1
      Editor="Player Name Who Edited String"
      KeyholeNumber=4603
      KeyNumber=4603
      Level=60
      PoolLiquidType=5
      RemainingExpireTime=1484
      RemainingUses=250
      Responsible=1074019305 (probably username)
      SavedExpireTime=117
      String="Read only"
  */
  const ATTRIBUTE_NAMES_MAP = {
    'id': 'itemId',
    'AbsTeleportDestination': 'absTeleportDestination',
    'Amount': 'amount',
    'Charges': 'chargesLeft',
    'ChestQuestNumber': 'chestQuestNumber',
    'ContainerLiquidType': 'containerLiquidType',
    'DoorQuestNumber': 'doorQuestNumber',
    'DoorQuestValue': 'doorQuestValue',
    'Editor': 'editedBy',
    'KeyholeNumber': 'keyNumberRequired',
    'KeyNumber': 'keyNumber',
    'Level': 'levelRequired',
    'PoolLiquidType': 'poolLiquidType',
    'RemainingExpireTime': 'expirationTimeRemaining',
    'RemainingUses': 'usesRemaining',
    'Responsible': 'responsiblePlayerId',
    'SavedExpireTime': 'savedExpirationTime',
    'String': 'string',
    '_id': 'id',
    '_childrenIds': 'childrenIds',
    '_parentId': 'parentId',
  }

  playerObjects.forEach(gmudObject => {
    const object = {};
    Object.keys(gmudObject).map(attribute => {
      if (attribute && gmudObject[attribute]) object[ATTRIBUTE_NAMES_MAP[attribute]] = gmudObject[attribute];
    });
    modelObjects.push(object);
  });
  return modelObjects;
};

module.exports.parseOutfitFunction = (rawValue) => {
  const [outfitId, partsRaw] = rawValue.replace(/[()]/g, '').split(',');
  const outfit = {
    id: outfitId,
  };
  const outfitParts = `${partsRaw}`.split('-');
  if (outfitParts.length === 4) {
    const [head, body, legs, feet] = outfitParts.map(part => parseInt(part));
    outfit.parts = { head, body, legs, feet };
  }
  return outfit;
};

module.exports.parseLocation = (rawValue) => {
  const [x, y, z] = rawValue.replace(/[\[\]]/g, '').split(',').map(part => parseInt(part));
  return [x, y, z];
};