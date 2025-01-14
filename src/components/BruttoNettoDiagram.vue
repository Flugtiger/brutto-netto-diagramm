<template>
    <svg
        ref="svgRef"
        @mouseenter="tooltipVisible = true"
        @mouseleave="tooltipVisible = false"
        @mousemove="onMousemove"
    ></svg>
    <div class="data-tooltip" v-if="true" :style="styleObject">
        <table>
            <tbody>
                <tr>
                    <td>Bruttoeinkommen:</td>
                    <td>{{ Math.round(currentX) }}&nbsp;€</td>
                </tr>
                <template v-for="input in inputs">
                    <tr v-if="input.fn(monthly ? currentX * 12 : currentX) != 0">
                        <td style="text-align: right">{{ input.legende }}:</td>
                        <td>
                            {{ input.type == Type.SUBSTRACT ? "-" : ""
                            }}{{ Math.round(monthly ? input.fn(currentX * 12) / 12 : input.fn(currentX)) }}&nbsp;€
                        </td>
                    </tr>
                </template>

                <tr class="summary-row">
                    <td>Nettoeinkommen:</td>
                    <td>{{ Math.round(calculateNetto(currentX)) }}&nbsp;€</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import * as d3 from "d3";
import { computed, onMounted, ref, useTemplateRef, type StyleValue } from "vue";
import { Type, type DiagramInput } from "./types";

const props = defineProps<{
    inputs: DiagramInput[];
}>();

const svgRef = useTemplateRef<SVGElement>("svgRef");
const tooltipVisible = ref(false);
const tooltipTop = ref(40);
const tooltipLeft = ref(60);
const currentX = ref(0);

const width = 800;
const height = 500;
const monthly = true;
const domainEnd = monthly ? 25000 / 12 : 25000;

const xScale = d3.scaleLinear().domain([0, domainEnd]).rangeRound([0, width]);
const yScale = d3.scaleLinear().domain([0, domainEnd]).rangeRound([height, 0]);

interface DataPoint {
    brutto: number;
    netto: number;
}

function calculateNetto(brutto: number) {
    if (monthly) {
        brutto *= 12;
    }
    let netto = brutto;
    for (const input of props.inputs) {
        let inputValue = input.fn(brutto);
        if (input.type == Type.ADD) {
            netto += inputValue;
        } else {
            netto -= inputValue;
        }
    }
    if (monthly) {
        netto /= 12;
    }
    return netto;
}

onMounted(() => {
    const svg = d3
        .select("svg")
        .attr("width", width + 100)
        .attr("height", height + 100);
    const g = svg.append("g").attr("transform", "translate(50,50)");

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width)
        .attr("dy", "-0.5em")
        .attr("text-anchor", "end")
        .text("Brutto " + (monthly ? "Monat" : "Jahr") + " (€)");

    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Netto " + (monthly ? "Monat" : "Jahr") + " (€)");

    const data: DataPoint[] = [];
    for (let x = 0; x <= width; x++) {
        const brutto = xScale.invert(x);
        const netto = calculateNetto(brutto);
        data.push({
            brutto,
            netto,
        });
    }

    const line = d3
        .line<DataPoint>()
        .x(function (d) {
            return xScale(d.brutto);
        })
        .y(function (d) {
            return yScale(d.netto);
        });

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    g.append("path")
        .datum([
            { brutto: 0, netto: 0 },
            { brutto: domainEnd, netto: domainEnd },
        ])
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 1.5)
        .attr("d", line);
});

const styleObject = computed<StyleValue>(() => ({
    position: "absolute",
    top: tooltipTop.value + "px",
    left: tooltipLeft.value + "px",
}));

function onMousemove(e: MouseEvent) {
    tooltipTop.value = e.clientY + 10;
    tooltipLeft.value = e.clientX + 10;
    const svgLeft = svgRef.value?.getBoundingClientRect().left || 0;
    const x = e.clientX - svgLeft - 50;
    if (x > 0) {
        currentX.value = xScale.invert(x);
    } else {
        currentX.value = 0;
    }
}
</script>

<style lang="css" scoped>
.data-tooltip {
    background-color: white;
    border: 1px solid gray;
}

.data-tooltip .summary-row {
    border-collapse: collapse;
}

.data-tooltip .summary-row td {
    border-top: 5px double black;
}
</style>
