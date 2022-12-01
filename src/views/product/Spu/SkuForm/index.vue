<template>
<div>
    <el-form label-width="80px">
        <el-form-item label="SPU名称"> {{ spuName }} </el-form-item>
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" v-model="skuInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(KG)">
            <el-input placeholder="重量(KG)" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
            <el-input type="textarea" placeholder="规格描述" rows="3" v-model="skuInfo.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form inline label-width="80px">
                <el-form-item v-for="(attr, index) of attrInfo" :key="attr.id" :label="attr.attrName" style="margin-bottom: 10px">
                    <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                        <el-option v-for="(value, index) of attr.attrValueList" :key="index" :value="`${attr.id}:${value.id}`" :label="value.valueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form inline>
                <el-form-item v-for="(saleAttr, index) of spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
                    <el-select placeholder="请选择" v-model="saleAttr.saleAttrIdAndSaleAttrValueId">
                        <el-option v-for="(
                                    saleValueAttr, index
                                ) of saleAttr.spuSaleAttrValueList" :key="saleValueAttr.id" :value="`${saleAttr.id}:${saleValueAttr.id}`" :label="saleValueAttr.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
            <el-table :data="spuImageList" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="80px"></el-table-column>
                <el-table-column label="图片" width="width">
                    <template scope="{row, $index}">
                        <img :src="row.imgUrl" :alt="row.imgName" style="width: 100px; height: 100px" />
                    </template>
                </el-table-column>
                <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
                <el-table-column label="操作" width="width">
                    <template scope="{row, $index}">
                        <el-button type="primary" @click="handleDefault(row)" v-if="row.isDefault == 0">设置默认</el-button>
                        <el-button v-else>默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="saveSku">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
export default {
    name: "SkuForm",
    data() {
        return {
            imageList: [],
            spuImageList: [],
            attrInfo: [],
            spuSaleAttrList: [],
            spuName: "",
            skuInfo: {
                category3Id: "",
                price: "",
                skuDefaultImg: "",
                skuDesc: "",
                skuName: "",
                spuId: "",
                tmId: "",
                weight: "",
                skuAttrValueList: [],
                skuImageList: [],
                skuSaleAttrValueList: [],
            },
        };
    },
    methods: {
        async getSpuImageList(spuId, row) {
            this.skuInfo.spuId = spuId;
            this.spuName = row.spuName;
            this.skuInfo.tmId = row.tmId;
            let result = await this.$API.spu.reqSpuImageList(spuId);
            if (result.code == 200) {
                let imgList = result.data;
                imgList.forEach((item) => {
                    this.$set(item, "isDefault", 0);
                });
                this.spuImageList = imgList;
            }
        },
        async getAttrInfo(category1Id, category2Id, category3Id) {
            this.skuInfo.category3Id = category3Id;
            let result = await this.$API.spu.reqAttrInfoList(
                category1Id,
                category2Id,
                category3Id
            );
            if (result.code == 200) {
                this.attrInfo = result.data;
            }
        },
        async getSpuSaleAttrList(spuId) {
            let result = await this.$API.spu.reqSpuSaleAttrList(spuId);
            if (result.code == 200) {
                this.spuSaleAttrList = result.data;
            }
        },
        handleCancel() {
            this.$bus.$emit("changeScene", {
                scene: 0,
                flag: "",
            });
            Object.assign(this._data, this.$options.data());
        },
        handleSelectionChange(params) {
            this.imageList = params;
        },
        handleDefault(row) {
            this.spuImageList.forEach((item) => {
                item.isDefault = 0;
            });
            row.isDefault = 1;
            this.skuInfo.skuDefaultImg = row.imgUrl;
        },
        async saveSku() {
            const {
                skuInfo,
                attrInfo,
                spuSaleAttrList,
                imageList
            } = this;

            skuInfo.skuAttrValueList = attrInfo.reduce((pre,item) => {
                if (item.attrIdAndValueId) {
                    const [attrId, valueId] = item.attrIdAndValueId.split(':');
                    pre.push({attrId, valueId})
                }
                return pre;
            },[])

            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((pre,item) => {
                if (item.saleAttrIdAndSaleAttrValueId) {
                    const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndSaleAttrValueId.split(':');
                    pre.push({saleAttrId, saleAttrValueId});
                }
                 return pre;
            }, [])

            skuInfo.skuImageList = imageList.map(item => {
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id
                }
            })

            let result = await this.$API.spu.reqSaveSku(skuInfo);
            if (result.code == 200) {
                this.$message({
                    type: 'success',
                    message: 'sku添加成功'
                });
                this.$bus.$emit('changeScene', {scene: 0, flag: ''});
            }

            Object.assign(this._data, this.$options.data());
        },
    },
};
</script>

<style>
</style>
