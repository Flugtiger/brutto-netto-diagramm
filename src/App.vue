<template>
    <Diagram :inputs="inputs" />
    <div class="footer">
        <hr />
        <a href="https://github.com/Flugtiger/brutto-netto-diagramm" target="_blank">
            <img width="20px" src="/github-mark.svg" />
        </a>
    </div>
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

<style scoped>
.footer {
    margin-top: 2em;
}
</style>
