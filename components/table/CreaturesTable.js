import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Image from "next/image";
import PageLink from "next/link";
import React from "react";
import CellItems from "./CellItems";
import { round } from "../../utils/Math";
import { Link } from "@mui/material";

/**
 * @TODO jsdoc
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function CreaturesTable({
  creatures = [],
  columns = standardColumns,
  tableProps,
} = {}) {

  return (
    <DataGrid
      rows={creatures}

      columns={columns}
      getRowHeight={() => 'auto'}

      initialState={{
        columns: {
          columnVisibilityModel: {
            flags: false,
          },
        },
        sorting: {
          sortModel: [{ field: 'experience', sort: 'asc' }],
        },
      }}

      slots={{
        toolbar: GridToolbar
      }}

      disableVirtualization

      {...tableProps}
    />
  );

}


export const columnModel = {
  id: { field: "id", headerName: "ID", valueGetter: (params) => params.row.id },


  sprite: {
    field: "sprite", headerName: "Sprite", renderCell: (params) => (
      <Image src={`/images/sprites/${params.row.outfit.id}.gif`} alt={params.row.id} width={32} height={32} />
    )
  },
  
  name: {
    field: "name", headerName: "Name", width: 130,
    renderCell: (params) => (
      <Link
        component={PageLink}
        href={`/creatures/${params.row.id}`}
      >
        {params.row.name}
      </Link>
    )
  },
  
  experience: { field: "experience", headerName: "Exp", valueGetter: (params) => params.row.experience },
  hitpoints: { field: "hitpoints", headerName: "HP", valueGetter: (params) => params.row.attributes.hitpoints },
  attack: { field: "attack", headerName: "Attack", valueGetter: (params) => params.row.attributes.attack || '' },
  defense: { field: "defense", headerName: "Defense", valueGetter: (params) => params.row.attributes.defense || '' },
  armor: { field: "armor", headerName: "Armor", valueGetter: (params) => params.row.attributes.armor },
  
  drops: {
    /** @TODO (future) replace with a horizontal  with the item image, name, rate and amount */
    field: "drops", headerName: "Drops", flex: 1, valueGetter: (params) => params.row.drops.sort((a, b) => b.rate - a.rate),
    renderCell: (params) => {
      const drops = params.row.drops.map(drop => ({
        label: drop ? `${(drop.amount > 1) ? `${drop.amount} ` : ''}${drop.item.name}` : '',
        link: { path: `/item/${drop.item.id}` }, value: `${round((drop.rate + 1) / 10, 3)}%`
      }));
      return <CellItems items={drops} />;
    }
  },
  
  spawns: {
    field: "spawns", headerName: "Spawns", width: 140, valueGetter: (params) => params.row.spawns.reduce((total, spawn) => total + spawn.amount, 0),
    renderCell: (params) => (
      params.value > 0 && (
        <Link
          component={PageLink}
          href={`/creatures/${params.row.id}?tab=spawns`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {`${params.row.spawns.reduce((total, spawn) => total + spawn.amount, 0)} in ${params.row.spawns.length} places`}
        </Link>
      )
    )
  },
  
  summonCost: { field: "summonCost", headerName: "Summon cost", valueGetter: (params) => params.row.summonCost || '' },
  
  flags: { field: "flags", headerName: "Flags", flex: 1, valueGetter: (params) => params.row.flags.join(', ') },
};

export const standardColumns = [
  columnModel.sprite,
  columnModel.name,
  columnModel.experience,
  columnModel.hitpoints,
  columnModel.attack,
  columnModel.defense,
  columnModel.armor,
  columnModel.drops,
  columnModel.spawns,
  columnModel.summonCost,
  columnModel.flags,
];
