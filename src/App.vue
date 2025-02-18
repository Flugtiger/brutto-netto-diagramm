<template>
    <h1>Brutto-Netto Diagramm</h1>
    <Diagram :inputs="inputs" :settings="{ kvErmäßigt: false }" />
    <div class="content">
        <p>
            Dieses Diagramm zeigt den Nettolohn in Abhängigkeit vom Bruttolohn. Dabei werden aktuell Bürgergeld,
            Sozialabgaben (KV, PV, AV, Rente) sowie die Lohnsteuer berücksichtigt.
        </p>
        <p>
            Die Berechnung basiert aktuell fest auf folgenden Parametern: Einzelperson, ledig, keine Kinder, nicht in
            Sachsen ansässig, Zusatzbeitrag Krankenversicherung: 2,5%.
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
import { Arbeitslosenversicherung } from "./components/arbeitslosenversicherung";
import Diagram from "./components/BruttoNettoDiagram.vue";
import { Bürgergeld } from "./components/bürgergeld";
import { Einkommensteuer } from "./components/einkommensteuer";
import { Krankenversicherung } from "./components/krankenversicherung";
import { Pflegeversicherung } from "./components/pflegeversicherung";
import { Rente } from "./components/rente";
import GithubMark from "./github-mark.svg";

const inputs = [Bürgergeld, Einkommensteuer, Rente, Krankenversicherung, Arbeitslosenversicherung, Pflegeversicherung];
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
