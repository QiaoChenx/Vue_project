<template>
    <div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script>
import echarts from "echarts";
export default {
    name: "LineChart",
    mounted() {
        let lineCharts = echarts.init(this.$refs.charts);
        lineCharts.setOption({
            xAxis: {
                show: false,
                type: 'category'
            },
            yAxis: {
                show: false,
            },
            series: [
                {
                    type: 'bar',
                    data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 33, 22, 8]
                }
            ],
            toolTip: {}
        });
    },
};
</script>

<style scoped>
.charts {
    width: 100%;
    height: 50px;
}
</style>
