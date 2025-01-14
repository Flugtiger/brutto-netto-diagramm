<template>
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
                <tr v-for="input in inputs">
                    <td>{{ input.legende }}:</td>
                    <td>{{ input.type == Type.SUBSTRACT ? "-" : "" }}{{ Math.round(input.fn(currentX)) }}&nbsp;€</td>
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
const domainEnd = 25000;

const xScale = d3.scaleLinear().domain([0, domainEnd]).rangeRound([0, width]);
const yScale = d3.scaleLinear().domain([0, domainEnd]).rangeRound([height, 0]);

interface DataPoint {
    brutto: number;
    netto: number;
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
        .text("Brutto (€)");

    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Netto (€)");

    const data: DataPoint[] = [];
    for (let x = 0; x <= width; x++) {
        const brutto = xScale.invert(x);
        let netto = brutto;
        for (const input of props.inputs) {
            const inputValue = input.fn(brutto);
            if (input.type == Type.ADD) {
                netto += inputValue;
            } else {
                netto -= inputValue;
            }
        }
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
</style>
