<template>
    <div ref="containerRef" style="position: relative">
        <svg
            ref="svgRef"
            @mouseenter="tooltipVisible = true"
            @mouseleave="tooltipVisible = false"
            @mousemove="onMousemove"
        ></svg>
        <div class="data-tooltip" v-if="tooltipVisible" :style="styleObject">
            <table>
                <tbody>
                    <tr>
                        <td>Bruttoeinkommen:</td>
                        <td>{{ Math.round(currentX) }}&nbsp;€</td>
                    </tr>
                    <template v-for="input in inputs">
                        <tr v-if="input.fn(monthly ? currentX * 12 : currentX, settings) != 0">
                            <td>{{ input.legende }}:</td>
                            <td>
                                {{ input.subtract ? "-" : "+"
                                }}{{
                                    Math.round(
                                        monthly ? input.fn(currentX * 12, settings) / 12 : input.fn(currentX, settings),
                                    )
                                }}&nbsp;€
                            </td>
                        </tr>
                    </template>

                    <tr>
                        <td>Nettoeinkommen:</td>
                        <td>{{ Math.round(calculateNetto(currentX)) }}&nbsp;€</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as d3 from "d3";
import { computed, onMounted, ref, useTemplateRef, watch, type StyleValue } from "vue";
import { type DiagramInput, type Settings } from "./types";

const props = defineProps<{
    inputs: DiagramInput[];
    settings: Settings;
}>();

const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const svgRef = useTemplateRef<SVGElement>("svgRef");
const tooltipVisible = ref(false);
const tooltipTop = ref(40);
const tooltipLeft = ref(60);
const currentX = ref(0);

const width = 800;
const height = 500;
const paddingLeft = 40;
const paddingBottom = 20;
const monthly = true;
const domainEnd = monthly ? 25000 / 12 : 25000;

const xScale = d3
    .scaleLinear()
    .domain([0, domainEnd])
    .range([0, width - paddingLeft]);

const yScale = d3
    .scaleLinear()
    .domain([0, domainEnd])
    .range([height - paddingBottom, 0]);

const line = d3
    .line<DataPoint>()
    .x(function (d) {
        return xScale(d.brutto);
    })
    .y(function (d) {
        return yScale(d.netto);
    });

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
        const value = input.fn(brutto, props.settings);
        if (input.subtract) {
            netto -= value;
        } else {
            netto += value;
        }
    }
    if (monthly) {
        netto /= 12;
    }
    return netto;
}

const svgG = ref<d3.Selection<SVGGElement, unknown, HTMLElement, any>>();

onMounted(() => {
    const svg = d3.select("svg").attr("width", width).attr("height", height);
    const g = svg.append("g").attr("transform", "translate(" + paddingLeft + ",0)");
    svgG.value = g;

    g.append("g")
        .attr("transform", "translate(0," + (height - paddingBottom) + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("fill", "currentColor")
        .attr("x", width - paddingLeft)
        .attr("dy", "-0.5em")
        .attr("text-anchor", "end")
        .text("Brutto " + (monthly ? "Monat" : "Jahr") + " (€)");

    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("fill", "currentColor")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Netto " + (monthly ? "Monat" : "Jahr") + " (€)");

    g.append("path")
        .datum([
            { brutto: 0, netto: 0 },
            { brutto: domainEnd, netto: domainEnd },
        ])
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    update();
});

function update() {
    const data: DataPoint[] = [];
    for (let x = 0; x <= width; x += 1) {
        const brutto = xScale.invert(x);
        const netto = calculateNetto(brutto);
        // console.log(brutto + ": " + netto);
        data.push({
            brutto,
            netto,
        });
    }

    const u = svgG.value!.selectAll(".netto-line").data([data]);

    u.enter()
        .append("path")
        .attr("class", "netto-line")
        .merge(u as any)
        .transition()
        .duration(2000)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

watch(props.settings, update);

const styleObject = computed<StyleValue>(() => ({
    position: "absolute",
    top: tooltipTop.value + "px",
    left: tooltipLeft.value + "px",
}));

function onMousemove(e: MouseEvent) {
    tooltipTop.value = e.clientY - containerRef.value!.getBoundingClientRect().top + 20;
    tooltipLeft.value = e.clientX - containerRef.value!.getBoundingClientRect().left + 20;
    const svgLeft = svgRef.value?.getBoundingClientRect().left || 0;
    const svgTop = svgRef.value?.getBoundingClientRect().top || 0;
    const x = e.clientX - svgLeft - paddingLeft;
    const y = e.clientY - svgTop;
    if (x > 0 && x < width && y > 0 && y < height) {
        tooltipVisible.value = true;
        currentX.value = xScale.invert(x);
    } else {
        currentX.value = 0;
        tooltipVisible.value = false;
    }
}
</script>

<style lang="css" scoped>
.data-tooltip {
    background-color: #242424;
    border: 1px solid rgba(255, 255, 255, 0.87);
    text-align: right;
}

.data-tooltip td {
    border-color: rgba(255, 255, 255, 0.87);
}

@media (prefers-color-scheme: light) {
    .data-tooltip {
        background-color: white;
        border: 1px solid gray;
        text-align: right;
    }

    .data-tooltip td {
        border-color: #213547;
    }
}

.data-tooltip table {
    border-collapse: collapse;
}

.data-tooltip td {
    padding: 0 4px;
}

.data-tooltip td:first-child {
    padding-right: 0.5em;
}

.data-tooltip tr:first-child td {
    border-bottom: 1px solid;
}

.data-tooltip tr:last-child td {
    border-top: 5px double;
}
</style>
