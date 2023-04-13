import { Box, Grid, Link, Tab, Tabs } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import database from "../../database/database.json";
import CellItems from '../../components/table/CellItems';
import TibiaMap from '../../components/tibiamap';
import { round } from '../../utils/Math';
import PageLink from "next/link";
import StandardPage from "../../components/StandardPage";
import Image from 'next/image';
import { TabContent, useTabContent } from "../../components/TabContent";
import { useState } from "react";
import CreaturesTable from "../../components/table/CreaturesTable";

const creatures = database.creatures;

/**
 * 
 * @param {Object} props The props.
 * @returns {import("react").ReactNode}
 */
export default function Creatures({

} = {}) {

  return (
    <StandardPage title='Creatures' contentProps={{ style: { height: '72vh' } }}>
      <Box style={{ height: '70vh' }}>
        <CreaturesTable creatures={creatures} />
      </Box>
    </StandardPage>
  );

}