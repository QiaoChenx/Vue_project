<template>
<div>
    <el-card class="box-card" style="margin: 10px 0">
        <div slot="header" class="clearfix">
            <el-tabs v-model="activeName">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visits"></el-tab-pane>
            </el-tabs>
            <div class="header_right">
                <span @click="getDay">今日</span>
                <span @click="getWeek">本周</span>
                <span @click="getMonth">本月</span>
                <span @click="getYear">本年</span>
                <el-date-picker v-model="date" type="daterange" range-separator="——" size="mini" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <div>
            <el-row :gutter="10">
                <el-col :span="18">
                    <div class="chart" ref="chart"></div>
                </el-col>
                <el-col :span="6">
                    <h3>
                        {{
                                this.activeName == "sale" ? "销售额" : "访问量"
                            }}排行
                    </h3>
                    <ul>
                        <li>
                            <span class="num">1</span>
                            <span>麦当劳</span>
                            <span class="right">323234</span>
                        </li>
                        <li>
                            <span class="num">2</span>
                            <span>麦当劳</span>
                            <span class="right">323234</span>
                        </li>
                        <li>
                            <span class="num">3</span>
                            <span>麦当劳</span>
                            <span class="right">323234</span>
                        </li>
                        <li>
                            <span class="origin">4</span>
                            <span>麦当劳</span>
                            <span class="right">323234</span>
                        </li>
                        <li>
                            <span class="origin">5</span>
                            <span>麦当劳</span>
                            <span class="right">323234</span>
                        </li>
                        <li>
                            <span class="origin">6</span>
                            <span>麦当劳</span>
                            <span class="right">323234</span>
                        </li>
                        <li>
                            <span class="origin">6</span>
                            <span>麦当劳</span>
                            <span class="right">323234</span>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
    </el-card>
</div>
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs'
export default {
    name: "Sale",
    data() {
        return {
            date: [],
            activeName: "sale",
        };
    },
    mounted() {
        let barChart = echarts.init(this.$refs.chart);
        barChart.setOption({
            title: {
                text: "销售额趋势",
            },
            xAxis: {
                type: "category",
                data: [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月",
                ],
            },
            yAxis: {
                type: "value",
            },
            series: [{
                type: "bar",
                data: [
                    400, 80, 200, 310, 350, 300, 220, 150, 120, 80, 200,
                    120, 280,
                ],
            }, ],
        });
    },
    watch: {
        activeName(val) {
            let barChart = echarts.init(this.$refs.chart);
            barChart.setOption({
                title: {
                    text: `${val=='sale'?'销售额':'访问量'}趋势`,
                },
            })
        }
    },
    methods: {
        getDay() {
            const day = dayjs().format('YYYY-MM-DD');
            this.date = [day, day];
        },
        getWeek() {
            const start = dayjs().day(1).format('YYYY-MM-DD');
            const end = dayjs().day(7).format('YYYY-MM-DD');
            this.date = [start, end];
        },
        getMonth() {
            const start = dayjs().startOf('month').format('YYYY-MM-DD');
            const end = dayjs().endOf('month').format('YYYY-MM-DD');
            this.date = [start, end];
        },
        getYear() {
            const start = dayjs().startOf('year').format('YYYY-MM-DD');
            const end = dayjs().endOf('year').format('YYYY-MM-DD');
            this.date = [start, end];
        }
    }
}
</script>

<style scoped>
>>>.el-card__header {
    border-bottom: none;
}

.box-card {
    position: relative;
}

.header_right {
    position: absolute;
    top: 25px;
    right: 20px;
}

span {
    margin-right: 20px;
}

.chart {
    width: 100%;
    height: 300px;
}

ul {
    padding: 0;
}

li {
    list-style: none;
    margin-bottom: 10px;
}

span.origin {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
}

span.num {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    background: #000;
    color: #fff;
}

span.right {
    float: right;
}
</style>
