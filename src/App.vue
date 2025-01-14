<template>
    <Diagram :inputs="inputs" />
</template>

<script setup lang="ts">
import { Arbeitslosenversicherung } from "./components/arbeitslosenversicherung";
import Diagram from "./components/BruttoNettoDiagram.vue";
import { Bürgergeld } from "./components/bürgergeld";
import { Einkommensteuer } from "./components/einkommensteuer";
import { Krankenversicherung } from "./components/krankenversicherung";
import { Rente } from "./components/rente";

const inputs = [Bürgergeld, Einkommensteuer, Rente, Krankenversicherung, Arbeitslosenversicherung];
</script>

<style scoped></style>
