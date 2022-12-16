<template>
<div>
    <el-table :data="records" style="width: 100%" border :cell-style="{ 'text-align': 'center' }" :header-cell-style="{'text-align': 'center'}">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
            <template scope="{row, $index}">
                <img :src="row.skuDefaultImg" alt="row.skuName" style="width: 100px; height: 100px" />
            </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="80">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="260">
            <template scope="{row, $index}">
                <el-button type="success" icon="el-icon-sort-up" size="mini" v-if="row.isSale == 1" @click="onSale(row)"></el-button>
                <el-button type="success" icon="el-icon-sort-down" size="mini" v-else @click="cancelSale(row)"></el-button>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click='handleEdit'></el-button>
                <el-button type="info" icon="el-icon-info" size="mini" @click="handleDrawer(row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="text-align: center" @size-change="handleSizeChange" @current-change="getSkuList" :current-page="page" :page-sizes="[10, 20, 50]" :page-size="limit" layout="prev, pager, next, jumper, ->, sizes, total" :total="total">
    </el-pagination>
    <el-drawer :visible.sync="drawer" @before-close="handleClose" size="50%" :show-close="false">
        <el-row>
            <el-col :span="5" align="right">名称</el-col>
            <el-col :span="15">{{ sku.skuName }}</el-col>
        </el-row>
        <el-row>
            <el-col :span="5" align="right">描述</el-col>
            <el-col :span="15">{{ sku.skuDesc }}</el-col>
        </el-row>
        <el-row>
            <el-col :span="5" align="right">价格</el-col>
            <el-col :span="15">{{ sku.price }}</el-col>
        </el-row>
        <el-row>
            <el-col :span="5" align="right">平台属性</el-col>
            <el-col :span="15">
                <el-tag type="success" v-for="(attr, index) of sku.skuAttrValueList" :key="index">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5" align="right">商品图片</el-col>
            <el-col :span="15">
                <el-carousel height="230px">
                    <el-carousel-item v-for="(item, index) in sku.skuImageList" :key="index">
                        <img :src="item.imgUrl" :alt="item.imgName" style="width: 100%; height: 100%" />
                    </el-carousel-item>
                </el-carousel>
            </el-col>
        </el-row>
    </el-drawer>
</div>
</template>

<script>
export default {
    name: "Sku",
    data() {
        return {
            page: 1,
            limit: 10,
            total: 50,
            records: [],
            drawer: false,
            sku: {},
        };
    },
    mounted() {
        this.getSkuList();
    },
    methods: {
        async getSkuList(pager = 1) {
            this.page = pager;
            const {
                page,
                limit
            } = this;
            let result = await this.$API.sku.reqSkuList(page, limit);
            if (result.code == 200) {
                this.records = result.data.records;
                this.total = result.data.total;
            }
        },
        handleSizeChange(limit = 10) {
            this.limit = limit;
            this.getSkuList();
        },
        async onSale(row) {
            let result = await this.$API.sku.reqCancelSale(row.id);
            if (result.code == 200) {
                this.$message({
                    type: "success",
                    message: "sku下架成功",
                });
                this.getSkuList();
            }
        },
        async cancelSale(row) {
            let result = await this.$API.sku.reqOnSale(row.id);
            if (result.code == 200) {
                this.$message({
                    type: "success",
                    message: "sku上架成功",
                });
                this.getSkuList();
            }
        },
        async handleDrawer(row) {
            this.drawer = true;
            let result = await this.$API.sku.reqSkuById(row.id);
            if (result.code == 200) {
                this.sku = result.data;
            }
        },
        handleClose(done) {
            this.sku = {};
            done();
        },
        handleEdit() {
            this.$message.info('该功能正在开发中 敬请期待！');
        }
    },
};
</script>

<style>
.el-drawer__header {
    padding: 0;
}

.el-col-5 {
    font-size: 16px;
    font-weight: 700;
}

.el-col-15 {
    line-height: 25px;
    margin: -3px 0 15px 15px;
}

.el-tag {
    margin: 0 5px 5px 0;
}
</style>
