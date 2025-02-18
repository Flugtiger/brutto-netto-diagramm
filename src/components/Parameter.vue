<template>
    <div>
        <label for="enableWohnkosten">Wohnkosten berücksichtigen:</label>
        <input id="enableWohnkosten" type="checkbox" v-model="enableWohnkosten" />
    </div>
    <div>
        <label for="kaltmiete">Kaltmiete:</label>
        <input id="kaltmiete" type="number" :disabled="!enableWohnkosten" v-model="wohnkosten.kaltmiete" />
    </div>
    <div>
        <label for="heizkosten">Heizkosten:</label>
        <input id="heizkosten" type="number" :disabled="!enableWohnkosten" v-model="wohnkosten.heizkosten" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Settings } from "./types";

const model = defineModel<Settings>({ required: true });

const enableWohnkosten = computed({
    get: () => model.value.wohnkosten != undefined,
    set: (value) => {
        if (value) {
            model.value.wohnkosten = wohnkosten.value;
        } else {
            model.value.wohnkosten = undefined;
        }
    },
});
const wohnkosten = ref({
    kaltmiete: 300,
    heizkosten: 20,
});
</script>
