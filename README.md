# Introduction

My personal GUI for the Tibia 7.7 database.

Also, my first project with [Next.js](https://nextjs.org/) + [Material-UI 5](https://mui.com/).

## Features

- Tables for the most important item types, containing relevant attributes (including related quests!)

# Requirements

- Node 16 or higher
  
# How to run

- Get yourself the [server dump](https://otland.net/threads/tutorial-for-running-7-7-cipsoft-server-on-ubuntu.274678/) of the leaked Tibia 7.7 server
- Download and install the [Tibia 7.7 client](https://www.tibiabr.com/downloads/clients-antigos/) (it must be this exact version)
- Move the following files to specific folders in this project:
    - `C:\Program Files (x86)\Tibia\Tibia.dat` to `api/dat`
    - `C:\Program Files (x86)\Tibia\Tibia.spr` to `api/sprites`
    - The `leaked-server/mon` directory to `api/creatures`
    - The `leaked-server/map` directory to `api/map`
    - The `leaked-server/npc` directory to `api/npcs`
    - `leaked-server/dat/objects.srv` to `api/objects`
- Go to each of the target folders above and run `node parse.js`. This will parse the original files to a friendly format that this project will understand
- Go to `./database` then run `node parse.js`. This will generate gifs from all sprites into the `./public/images` folder, as well as create a simple JSON database in `./database/database.json`
- Go to the root folder of this project and run `npm run dev`
- Open the link provided in the terminal log then navigate to one of the pages in the routes (e.g.: http://localhost:3000/items/shields)
