<template>
    <h1>Brutto-Netto Diagramm</h1>
    <Diagram :inputs="inputs" :settings="settings" />
    <Parameter v-if="mode != 'production'" v-model="settings" />
    <div class="content">
        <p>
            Dieses Diagramm zeigt den Nettolohn in Abhängigkeit vom Bruttolohn. Dabei werden aktuell Bürgergeld,
            Sozialabgaben (KV, PV, AV, Rente) sowie die Lohnsteuer berücksichtigt.
        </p>
        <p>
            Die Berechnung basiert auf dem Rechtsstand 2025 und rechnet aktuell fest mit folgenden Parametern:
            Einzelperson, ledig, keine Kinder, nicht in Sachsen ansässig, Zusatzbeitrag Krankenversicherung: 2,5%.
        </p>
    </div>
    <div class="footer">
        <hr />
        <a href="https://github.com/Flugtiger/brutto-netto-diagramm" target="_blank">
            <GithubMark width="20" height="20" viewBox="0 0 98 96" />
        </a>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Diagram from "./components/BruttoNettoDiagram.vue";
import Parameter from "./components/Parameter.vue";
import type { Settings } from "./components/types";
import GithubMark from "./github-mark.svg";
import { Arbeitslosenversicherung } from "./inputs/arbeitslosenversicherung";
import { Bürgergeld } from "./inputs/bürgergeld";
import { Einkommensteuer } from "./inputs/einkommensteuer";
import { Krankenversicherung } from "./inputs/krankenversicherung";
import { Pflegeversicherung } from "./inputs/pflegeversicherung";
import { Rente } from "./inputs/rente";
import { Wohnkosten } from "./inputs/wohnkosten";

const mode = import.meta.env.MODE;
const settings = ref<Settings>({ kvErmäßigt: false });
const inputs = [
    Bürgergeld,
    Einkommensteuer,
    Rente,
    Krankenversicherung,
    Arbeitslosenversicherung,
    Pflegeversicherung,
    Wohnkosten,
];
</script>

<style scoped>
.content {
    text-align: justify;
}
.footer {
    margin-top: 2em;
    text-align: center;
}

.footer :deep(path) {
    fill: lightgray;
}

@media (prefers-color-scheme: light) {
    .footer :deep(path) {
        fill: initial;
    }
}
</style>
