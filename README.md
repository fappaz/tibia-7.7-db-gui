- [Features](#features)
  - [TODOs](#todos)
- [How to run](#how-to-run)
  - [Requirements](#requirements)
  - [Instructions](#instructions)

![](https://firebasestorage.googleapis.com/v0/b/tibiago-explorer.appspot.com/o/2023-05-06_14-39.mp4?alt=media)

My personal GUI for the Tibia 7.7 database.

Also, my first test project with [Next.js](https://nextjs.org/) + [Material-UI 5](https://mui.com/).

# Features

- Tables for the most important item types and their relevant attributes (including related quests!)
- Map with all spawns, quests and NPCs
- Official loot rate for all items and creatures

## TODOs

- Runes
- Spells
  - Eremo spells are missing
- NPC offers
- Skill calculator
- Outfit builder
- Quest guides
- Houses
- Other map layers
  
# How to run

## Requirements

- Node 18 or higher

## Instructions

For legal reasons, the original files cannot be provided in this repository, so you must find them yourself. See instructions below:

- Get yourself the [server dump](https://otland.net/threads/tutorial-for-running-7-7-cipsoft-server-on-ubuntu.274678/) of the leaked Tibia 7.7 server
- Download and install the [Tibia 7.7 client](https://www.tibiabr.com/downloads/clients-antigos/) (it must be this exact version)
- Move the following files to specific folders in this project:
    - `C:\Program Files (x86)\Tibia\Tibia.dat` to `api/dat`
    - `C:\Program Files (x86)\Tibia\Tibia.spr` to `api/sprites`
    - The `leaked-server/mon` directory to `api/creatures`
    - The `leaked-server/dat/monster.db` directory to `api/creatures`
    - The `leaked-server/origmap` directory to `api/origmap`
    - The `leaked-server/npc` directory to `api/npcs`
    - `leaked-server/dat/objects.srv` to `api/objects`
- Go to each of the target folders above and run `node parse.js`. This will parse the original files to a friendly format that this project will understand
- Go to `./database` then run `node parse.js`. This will generate the following files:
    - `creatures.json`
    - `npcs.json`
    - `objects.json`
    - `quests.json`
    - `spells.json`
- Still inside `./database`, run `node generateSprites.js`. This will generate the following:
    - gifs from all sprites into the `./public/images/sprites` folder
    - pngs of one frame from each gif above
- Go to the root folder of this project, then run:

```sh
npm i ; npm run dev
```

- Open the link provided in the terminal log then navigate to one of the pages in the routes (e.g.: http://localhost:3000/map)
