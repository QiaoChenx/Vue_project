<template>
    <div>
        <el-card style="margin: 20px 0">
            <CategorySelector
                @getCategoryId="getCategoryId"
                :show="show"
            ></CategorySelector>
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    :disabled="!category3Id"
                    @click="addAttr"
                    >添加属性</el-button
                >
                <el-table :data="attrList" border>
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="attrName"
                        label="属性名称"
                        width="150"
                    ></el-table-column>
                    <el-table-column label="属性值名称" width="width">
                        <template slot-scope="{ row, $index }">
                            <el-tag
                                type="success"
                                v-for="(val, index) of row.attrValueList"
                                :key="val.id"
                                style="margin: 0 5px 5px 0"
                                >{{ val.valueName }}</el-tag
                            >
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="{ row, $index }">
                            <el-button
                                type="warning"
                                icon="el-icon-edit"
                                size="mini"
                                @click="editAttr(row)"
                            ></el-button>
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                            ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="!isShowTable">
                <el-form inline :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input
                            placeholder="请输入属性名"
                            v-model="attrInfo.attrName"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="addValueAttr"
                    :disabled="!attrInfo.attrName"
                    >添加属性值</el-button
                >
                <el-button @click="isShowTable = true">取消</el-button>
                <el-table
                    border
                    style="margin: 20px 0"
                    :data="attrInfo.attrValueList"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="80"
                    ></el-table-column>
                    <el-table-column label="属性值名称" width="width">
                        <template slot-scope="{ row, $index }">
                            <el-input
                                v-show="row.flag"
                                v-model="row.valueName"
                                placeholder="请输入属性值"
                                size="mini"
                                @blur="handleBlur(row)"
                                @keyup.native.enter="handleBlur(row)"
                                ref="valueName"
                            ></el-input>
                            <span
                                v-show="!row.flag"
                                @click="editAttrValue(row, $index)"
                                >{{ row.valueName }}</span
                            >
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope="{ row, $index }">
                            <el-popconfirm
                                :title="`确定删除${row.valueName}吗？`"
                                @onConfirm="handleDelete($index)"
                            >
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    slot="reference"
                                    >删除</el-button
                                >
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button
                    type="primary"
                    @click="handleSave"
                    :disabled="!attrInfo.attrValueList.length"
                    >保存</el-button
                >
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "Attr",
    data() {
        return {
            category1Id: "",
            category2Id: "",
            category3Id: "",
            attrList: [],
            isShowTable: true,
            attrInfo: {
                attrName: "",
                attrValueList: [],
                categoryId: 0,
                categoryLevel: 3,
            },
            show: false,
        };
    },
    methods: {
        getCategoryId({ categoryId, level }) {
            if (level == 1) {
                this.category1Id = categoryId;
                this.category2Id = "";
                this.category3Id = "";
                this.attrList = [];
            } else if (level == 2) {
                this.category2Id = categoryId;
                this.category3Id = "";
                this.attrList = [];
            } else {
                this.category3Id = categoryId;
                this.getAttrList();
            }
        },
        async getAttrList() {
            const { category1Id, category2Id, category3Id } = this;
            let result = await this.$API.attr.reqAttrList(
                category1Id,
                category2Id,
                category3Id
            );
            if (result.code == 200) {
                this.attrList = result.data;
            }
        },
        addAttr(row) {
            this.isShowTable = false;
            this.attrInfo = {
                attrName: "",
                attrValueList: [],
                categoryId: this.category3Id,
                categoryLevel: 3,
            };
            this.show = true;
        },
        editAttr(row) {
            this.isShowTable = false;
            this.attrInfo = cloneDeep(row);
            this.attrInfo.attrValueList.forEach((item) => {
                this.$set(item, "flag", false);
            });
        },
        addValueAttr() {
            this.attrInfo.attrValueList.push({
                attrId: this.attrInfo.id,
                valueName: "",
                flag: true,
            });
            this.$nextTick(() => {
                this.$refs.valueName.focus();
            });
        },
        handleBlur(row) {
            if (!row.valueName.trim()) {
                this.$message("数据不能为空");
                return false;
            }
            let isRepeat = this.attrInfo.attrValueList.every((item) => {
                if (item != row) {
                    return item.valueName != row.valueName;
                } else {
                    return true;
                }
            });
            if (!isRepeat) {
                this.$message("数据不能重复");
                return false;
            }
            row.flag = false;
        },
        editAttrValue(row) {
            row.flag = true;
            this.$nextTick(() => {
                this.$refs.valueName.focus();
            });
        },
        async handleSave() {
            // this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
            //   return item.valueName.trim() != '';
            // })
            let result = await this.$API.attr.reqAddAttr(this.attrInfo);
            if (result.code == 200) {
                this.getAttrList();
                if (this.attrInfo.id) {
                    this.$message({
                        type: "success",
                        message: "数据修改成功",
                    });
                } else {
                    this.$message({
                        type: "success",
                        message: "数据添加成功",
                    });
                }
                this.isShowTable = true;
            } else {
                alert(result.data);
            }
        },
        handleDelete(index) {
            this.attrInfo.attrValueList.splice(index, 1);
        },
    },
};
</script>

<style>
</style>
