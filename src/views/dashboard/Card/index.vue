<template>
<div>
    <el-row :gutter="10">
        <el-col :span="6">
            <el-card>
                <Detail title="总销售量" price="￥126560">
                    <template slot="chart">
                        <span style="font-size: 10px">
                            周同比 56.67%
                            <svg t="1659076841609" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3180" width="12" height="12">
                                <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="3181"></path>
                            </svg>
                            日同比 19.16%
                            <svg t="1659077025195" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3743" width="12" height="12">
                                <path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3744"></path>
                            </svg>
                        </span>
                    </template>
                    <template slot="footer"> 日销售额￥12423 </template>
                </Detail>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <Detail title="访问量" price="88460">
                    <template slot='chart'>
                            <LineChart></LineChart>
                    </template>
                    <template slot="footer"> 日访问量 1234 </template>
                </Detail>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <Detail title="支付笔数" price="88460">
                    <template slot="chart">
                            <BarChart></BarChart>
                    </template>
                    <template slot="footer"> 转化率 65% </template>
                </Detail>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <Detail title="运营活动效果" price="78%">
                    <template slot="chart">
                            <ProgressChart></ProgressChart>
                    </template>
                    <template slot="footer">
                        周同比 56.67%
                        <svg t="1659076841609" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3180" width="12" height="12">
                            <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="3181"></path>
                        </svg>
                        日同比 19.16%
                        <svg t="1659077025195" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3743" width="12" height="12">
                            <path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3744"></path>
                        </svg>
                    </template>
                </Detail>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script>
import Detail from "./Detail";
import LineChart from './LineChart'
import BarChart from './BarChart'
import ProgressChart from './ProgressChart'
export default {
    name: "Card",
    components: {
        Detail,
        LineChart,
        BarChart,
        ProgressChart
    },
};
</script>

<style>
</style>
