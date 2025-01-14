<template>
    <Diagram :inputs="inputs" />
</template>

<script setup lang="ts">
import Diagram from "./components/BruttoNettoDiagram.vue";
import { Bürgergeld } from "./components/bürgergeld";
import { Einkommensteuer } from "./components/einkommensteuer";
import { Rente } from "./components/rente";

const inputs = [Bürgergeld, Einkommensteuer, Rente];
</script>

<style scoped></style>
