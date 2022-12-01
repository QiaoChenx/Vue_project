<template>
<div>
    <el-form label-width="80px" :model="spu">
        <el-form-item label="SPU名称">
            <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
            <el-select placeholder="请选择品牌" v-model="spu.tmId">
                <el-option v-for="(trade, index) of trademarkList" :label="trade.tmName" :value="trade.id" :key="trade.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="SPU描述" rows="5" v-model="spu.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="imageList" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-select :placeholder="`还有${unSelected.length}未选择`" v-model="attrIdAndAttrName">
                <el-option v-for="(attr, index) of unSelected" :key="attr.id" :label="attr.name" :value="`${attr.id}:${attr.name}`"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        </el-form-item>
        <el-table border style="margin-bottom: 20px" :data="spu.spuSaleAttrList">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="saleAttrName" label="属性名" width="150">
            </el-table-column>
            <el-table-column label="属性值名称" width="width">
                <template slot-scope="{ row, $index }">
                    <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="handleClose(row, index)">
                        {{ tag.saleAttrValueName }}
                    </el-tag>
                    <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="$event.target.blur" @blur="handleInputConfirm(row)">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ 添加</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="{row, $index}">
                    <el-button type="danger" icon='el-icon-delete' size="mini" @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="handleChangeScene">取消</el-button>
    </el-form>
</div>
</template>

<script>
export default {
    name: "SpuForm",
    data() {
        return {
            dialogImageUrl: "",
            dialogVisible: false,
            spu: {
                category3Id: "",
                description: "",
                spuName: "",
                tmId: "",
                spuImageList: [],
                spuSaleAttrList: [],
            },
            trademarkList: [],
            imageList: [],
            saleAttrList: [],
            attrIdAndAttrName: "",
        };
    },
    methods: {
        handleRemove(file, fileList) {
            this.imageList = fileList;
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleChangeScene() {
            this.$bus.$emit("changeScene", {
                scene: 0,
                flag: ''
            });
            Object.assign(this._data, this.$options.data());
        },
        async initSpuData(spu) {
            let result = await this.$API.spu.reqSpu(spu.id);
            if (result.code == 200) {
                this.spu = result.data;
            }

            let trademarkResult = await this.$API.spu.reqTrademarkList();
            if (trademarkResult.code == 200) {
                this.trademarkList = trademarkResult.data;
            }

            let imageListResult = await this.$API.spu.reqSpuImageList(spu.id);
            if (imageListResult.code == 200) {
                let origin = imageListResult.data;
                origin.forEach((item) => {
                    item.name = item.imgName;
                    item.url = item.imgUrl;
                });
                this.imageList = origin;
            }

            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data;
            }
        },
        handleSuccess(response, file, fileList) {
            this.imageList = fileList;
        },
        handleClose(row, index) {
            row.spuSaleAttrValueList.splice(index, 1);
        },
        showInput(row) {
            this.$set(row, "inputVisible", true);
            this.$set(row, "inputValue", "");
            this.$nextTick(() => {
                this.$refs.saveTagInput.focus();
            });
        },
        handleInputConfirm(row) {
            let inputValue = row.inputValue.trim();
            if (inputValue) {
                let isRepeat = row.spuSaleAttrValueList.some((item) => {
                    return item.saleAttrValueName == inputValue;
                });
                if (isRepeat) {
                    this.$message("数据不能重复");
                    return false;
                }
                row.spuSaleAttrValueList.push({
                    baseSaleAttrId: row.baseSaleAttrId,
                    saleAttrValueName: inputValue,
                });
            } else {
                this.$message("数据不能为空");
                return false;
            }

            row.inputVisible = false;
            row.inputValue = "";
        },
        addSaleAttr() {
            const [baseSaleAttrId, saleAttrName] =
            this.attrIdAndAttrName.split(":");
            this.spu.spuSaleAttrList.push({
                baseSaleAttrId,
                saleAttrName,
                spuSaleAttrValueList: [],
            });
            this.attrIdAndAttrName = "";
        },
        async addOrUpdateSpu() {
            this.spu.spuImageList = this.imageList.map(item => {
                return {
                    imgUrl: (item.response && item.response.data) || item.url,
                    imgName: item.name
                }
            })
            let result = await this.$API.spu.addOrUpdateSpu(this.spu);
            if (result.code == 200) {
                if (this.spu.id) {
                    this.$message({
                        type: 'success',
                        message: '数据修改成功'
                    })
                    this.$bus.$emit('changeScene', {
                        scene: 0,
                        flag: 1
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '数据添加成功'
                    })
                    this.$bus.$emit('changeScene', {
                        scene: 0,
                        flag: 0
                    });
                }
            }
            Object.assign(this._data, this.$options.data())
        },
        async addSpu(category3Id) {
            this.spu.category3Id = category3Id;
            let trademarkResult = await this.$API.spu.reqTrademarkList();
            if (trademarkResult.code == 200) {
                this.trademarkList = trademarkResult.data;
            }

            let saleResult = await this.$API.spu.reqBaseSaleAttrList();
            if (saleResult.code == 200) {
                this.saleAttrList = saleResult.data;
            }
        }
    },
    computed: {
        unSelected() {
            return this.saleAttrList.filter((item) => {
                return this.spu.spuSaleAttrList.every((item1) => {
                    return item.name != item1.saleAttrName;
                });
            });
        },
    },
};
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
