<template>
    <div>
        <el-card style="margin: 20px 0">
            <CategorySelector
                @getCategoryId="getCategory"
                :show="scene != 0"
            ></CategorySelector>
        </el-card>
        <el-card>
            <div v-show="scene == 0">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addSpu"
                    :disabled="!category3Id"
                    >添加SPU</el-button
                >
                <el-table border :data="records">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column prop="spuName" label="spu名称" width="150">
                    </el-table-column>
                    <el-table-column
                        prop="description"
                        label="spu描述"
                        width="width"
                    >
                    </el-table-column>
                    <el-table-column label="操作" width="260">
                        <template slot-scope="{ row, $index }">
                            <el-button
                                type="success"
                                icon="el-icon-plus"
                                size="mini"
                                title="添加sku"
                                @click="addSku(row)"
                            ></el-button>
                            <el-button
                                type="warning"
                                icon="el-icon-edit"
                                size="mini"
                                title="修改spu"
                                @click="editSpu(row)"
                            ></el-button>
                            <el-button
                                type="info"
                                icon="el-icon-info"
                                size="mini"
                                title="查看当前spu全部sku列表"
                                @click="handleSku(row)"
                            ></el-button>
                            <el-popconfirm
                                style="margin-left: 10px"
                                :title="`确定要删${row.spuName}吗？`"
                                @onConfirm="handleDeleteSpu(row)"
                            >
                                <el-button
                                    slot="reference"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    title="删除spu"
                                ></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="getSpuList"
                    :current-page="page"
                    :page-sizes="[3, 5, 10]"
                    :page-size="limit"
                    layout="prev, pager, next, jumper, ->, sizes, total"
                    :total="total"
                    style="text-align: center; margin-top: 20px"
                >
                </el-pagination>
                <el-dialog
                    :title="`${sku.spuName}的sku列表`"
                    :visible.sync="dialogTableVisible"
                    @before-close="handleClose"
                >
                    <el-table :data="sku" v-loading="loading">
                        <el-table-column
                            prop="skuName"
                            label="名称"
                            width="width"
                        ></el-table-column>
                        <el-table-column
                            prop="price"
                            label="价格"
                            width="width"
                        ></el-table-column>
                        <el-table-column
                            prop="weight"
                            label="重量"
                            width="width"
                        ></el-table-column>
                        <el-table-column label="默认图片" width="width">
                            <template scope="{row, $index}">
                                <img
                                    style="width: 100px; height: 100px"
                                    :src="row.skuDefaultImg"
                                    :alt="row.skuName"
                                />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-dialog>
            </div>
            <SpuForm v-show="scene == 1" ref="spu"></SpuForm>
            <SkuForm v-show="scene == 2" ref="sku"></SkuForm>
        </el-card>
    </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
    name: "Spu",
    data() {
        return {
            category1Id: "",
            category2Id: "",
            category3Id: "",
            page: 1,
            limit: 3,
            total: 0,
            records: [],
            scene: 0,
            sku: [],
            dialogTableVisible: false,
            loading: true,
        };
    },
    methods: {
        getCategory({ categoryId, level }) {
            if (level == 1) {
                this.category1Id = categoryId;
                this.category2Id = "";
                this.category3Id = "";
                this.records = [];
            } else if (level == 2) {
                this.category2Id = categoryId;
                this.category3Id = "";
                this.records = [];
            } else {
                this.category3Id = categoryId;
                this.getSpuList();
            }
        },
        async getSpuList(pager = 1) {
            this.page = pager;
            const { page, limit, category3Id } = this;
            let result = await this.$API.spu.reqSpuList(
                page,
                limit,
                category3Id
            );
            if (result.code == 200) {
                this.records = result.data.records;
                this.total = result.data.total;
            }
        },
        handleSizeChange(limit = 1) {
            this.limit = limit;
            this.getSpuList();
        },
        addSpu() {
            this.scene = 1;
            this.$refs.spu.addSpu(this.category3Id);
        },
        editSpu(row) {
            this.scene = 1;
            this.$refs.spu.initSpuData(row);
        },
        async handleDeleteSpu(row) {
            let result = await this.$API.spu.reqDeleteSpu(row.id);
            if (result.code == 200) {
                if (this.records.length > 1) {
                    this.getSpuList(this.page);
                } else {
                    this.getSpuList();
                }
            }
        },
        addSku(row) {
            this.scene = 2;
            const { category1Id, category2Id, category3Id } = this;
            this.$refs.sku.getSpuImageList(row.id, row);
            this.$refs.sku.getAttrInfo(category1Id, category2Id, category3Id);
            this.$refs.sku.getSpuSaleAttrList(row.id);
        },
        async handleSku(row) {
            let result = await this.$API.spu.reqGetSku(row.id);
            if (result.code == 200) {
                this.loading = false;
                this.sku = result.data;
                this.sku.spuName = row.spuName;
            }
            this.dialogTableVisible = true;
        },
        handleClose(done) {
            this.sku = [];
            this.loading = true;
            done()
        },
    },
    components: {
        SpuForm,
        SkuForm,
    },
    mounted() {
        this.$bus.$on("changeScene", ({ scene, flag }) => {
            this.scene = scene;
            if (flag) {
                this.getSpuList(this.page);
            } else {
                this.getSpuList();
            }
        });
    },
};
</script>

<style>
</style>
