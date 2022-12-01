<template>
<div>
    <el-button type="primary" icon="el-icon-plus" @click="toAdd">添加</el-button>
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
        <el-form style="width: 80%" label-width="100px" :model="tmForm" :rules="rules" ref="tmForm">
            <el-form-item label="活动名称" prop="tmName">
                <el-input v-model="tmForm.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" prop="logoUrl">
                <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">
                        只能上传jpg/png文件，且不超过500kb
                    </div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
        </div>
    </el-dialog>
    <el-table border style="margin: 20px 0" :data="records" :cell-style="{'text-align': 'center'}" :header-cell-style="{'text-align': 'center'}">
        <el-table-column type="index" label="序号" width="80" ></el-table-column>
        <el-table-column prop="tmName" label="品牌管理" width="150"></el-table-column>
        <el-table-column label="品牌LOGO" width="width">
            <template slot-scope="{ row, $index }">
                <img :src="row.logoUrl" style="width: 100px; height: 100px" />
            </template>
        </el-table-column>
        <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="toEdit(row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="text-align: center" @size-change="handleSizeChange" @current-change="getData" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper, ->, sizes, total" :total="total">
    </el-pagination>
</div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "trademark",
    data() {
        return {
            page: 1,
            limit: 3,
            records: [],
            total: 0,
            dialogFormVisible: false,
            tmForm: {
                tmName: "",
                logoUrl: "",
            },
            rules: {
                tmName: [{
                        required: true,
                        message: "请输入品牌名称",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 6,
                        message: "长度为2-6",
                        trigger: "change",
                    },
                ],
                logoUrl: [{
                    required: true,
                    message: "请选择品牌LOGO",
                }, ],
            },
        };
    },
    methods: {
        handleSizeChange(limit = 3) {
            this.limit = limit;
            this.getData();
        },
        async getData(pager = 1) {
            this.page = pager;
            const {
                page,
                limit
            } = this;
            let result = await this.$API.trademark.reqBaseTrademark(
                page,
                limit
            );
            if (result.code == 200) {
                this.records = result.data.records;
                this.total = result.data.total;
            }
        },
        toAdd() {
            this.dialogFormVisible = true;
            this.tmForm = {};
        },
        handleAvatarSuccess(res, file) {
            this.tmForm.logoUrl = res.data;
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        addOrUpdateTrademark() {
            this.$refs.tmForm.validate(async (success) => {
                if (success) {
                    let result =
                        await this.$API.trademark.reqSaveOrUpdateTrademark(
                            this.tmForm
                        );
                    if (result.code == 200) {
                        this.dialogFormVisible = false;
                        if (this.tmForm.id) {
                            this.$message({
                                type: "success",
                                message: "品牌修改成功",
                            });
                            this.getData(this.page);
                        } else {
                            this.$message({
                                type: "success",
                                message: "品牌添加成功",
                            });
                            this.getData();
                        }
                    } else {
                        this.$message("上传失败");
                    }
                } else {
                    alert("error submit!!!");
                    return false;
                }
            });
        },
        toEdit(row) {
            this.dialogFormVisible = true;
            this.tmForm = cloneDeep(row);
        },
        handleDelete(row) {
            this.$confirm(`您确定要删除${row.tmName}吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(async () => {
                    let result = await this.$API.trademark.reqRemoveTrademark(
                        row.id
                    );
                    if (result.code == 200) {
                        this.getData();
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                    } else {
                        return result.data;
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
    },
    mounted() {
        this.getData();
    },
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
