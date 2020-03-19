<template>
    <div class="app-container">
        <div>
            <el-steps :active="active" finish-status="success">
                <el-step title="步骤 1" description="构建reader">1</el-step>
                <el-step title="步骤 2" description="构建writer">2</el-step>
                <el-step title="步骤 3" description="字段映射">3</el-step>
                <el-step title="步骤 4" description="构建">4</el-step>
            </el-steps>
            <!-- <el-button :disabled="active===1" style="margin-top: 12px;" @click="last">上一步</el-button>
            <el-button style="margin-top: 12px;margin-bottom: 12px;" @click="next">下一步</el-button> -->

            <div v-show="active===1" class="step1">
                <Reader ref="reader" />
            </div>
            <!-- <div v-show="active===2" class="step2">
                 <Writer ref="writer" />
             </div>
            <div v-show="active===3" class="step3">
                 <Mapper ref="mapper" />
            </div> -->
            <!-- <div v-show="active===4" class="step4">
                <el-button type="primary" @click="buildJson">构建</el-button>
                <el-button type="info" @click="handleCopy(inputData,$event)">copy json</el-button>
                <el-button type="text" @click="handleJobTemplateSelectDrawer">{{ jobTemplate ? jobTemplate : "选择模板(操作步骤：构建->选择模板->下一步)" }}</el-button>
                <el-drawer
                    ref="jobTemplateSelectDrawer"
                    title="选择模板"
                    :visible.sync="jobTemplateSelectDrawer"
                    direction="rtl"
                    size="50%">
                    <el-table
                        v-loading="listLoading"
                        :data="list"
                        element-loading-text="Loading"
                        border
                        fit
                        highlight-current-row
                        destroy-on-close="true"
                        @current-change="handleCurrentChange">
                        <el-table-column align="center" label="任务ID" width="80">
                            <template slot-scope="scope">{{ scope.row.id }}</template>
                        </el-table-column>
                        <el-table-column label="任务描述" align="center">
                            <template slot-scope="scope">{{ scope.row.jobDesc }}</template>
                        </el-table-column> 
                        <el-table-column label="Cron" align="center">
                            <template slot-scope="scope"><span>{{ scope.row.jobCron }}</span></template>
                        </el-table-column>
                        <el-table-column label="路由策略" align="center">
                            <template slot-scope="scope"> {{ routeStrategies.find(t => t.value === scope.row.executorRouteStrategy).label }}</template>
                        </el-table-column>
                        <el-table-column label="负责人" align="center">
                            <template slot-scope="scope">{{ scope.row.author }}</template>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
                </el-drawer>
                <div style="margin-bottom: 20px;" />
                <json-editor v-show="active===4" ref="jsonEditor" v-model="configJson" />
            </div> -->
        </div>
    </div>
</template>

<script>
import Reader from './reader'

export default {
    components: { Reader},
    data() {
        return {
            
        }
    },
}
</script>