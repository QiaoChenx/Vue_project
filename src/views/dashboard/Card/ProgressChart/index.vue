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
                min: 0,
                max: 100
            },
            yAxis: {
                show: false,
                type: 'category'
            },
            series: [
                {
                    type: 'bar',
                    data: [78],
                    color: 'yellowgreen',
                    barWidth: 10,
                    showBackground: true,
                    label: {
                        show: true,
                        formatter: '|',
                        position: 'right'
                    }
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
