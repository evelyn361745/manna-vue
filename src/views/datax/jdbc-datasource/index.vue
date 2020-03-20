<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="search_data"
        clearable
        placeholder="数据源名称"
      />
      <el-button type="primary" @click="handleSearch">Search</el-button>
      <el-button type="primary" @click="handleCreate">Add</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="数据源" width="200" align="center">
        <template slot-scope="scope">{{ scope.row. type}}</template>
      </el-table-column>
      <el-table-column label="数据源名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.dbname }}</template>
      </el-table-column>
      <el-table-column label="用户名" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.user ? scope.row.user:'-' }}</template>
      </el-table-column>
      <el-table-column label="jdbc url" width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.jdbcurl ? scope.row.jdbcurl:'-' }}</template>
      </el-table-column>
      <el-table-column label="jdbc驱动类" width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.jdbcdriver ? scope.row.jdbcdriver:'-' }}</template>
      </el-table-column>
      <el-table-column label="comments" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.description? scope.row.description:'-' }}</template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="dataForm" :model="datasourceform" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="数据源名称" prop="dbname">
          <el-input v-model="datasourceform.dbname" placeholder="数据源名称" style="width:60%" />
        </el-form-item>
        <el-form-item label="主机" prop="host">
          <el-input v-model="datasourceform.host" placeholder="主机" style="width:60%" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="datasourceform.port" placeholder="端口号" style="width:60%" />
        </el-form-item>
        <el-form-item label="数据源类型" prop="type">
          <el-select v-model="datasourceform.type" placeholder="数据源类型" style="width:260px" @change="selectDataSource(datasourceform.type)">
            <el-option v-for="item in dataSources" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="user">
          <el-input v-model="datasourceform.user" placeholder="用户名" style="width:60%" />
        </el-form-item>
        <el-form-item v-if="visible" label="密码" prop="passwd">
          <el-input v-model="datasourceform.passwd" placeholder="密码" style="width:60%">
            <i slot="suffix" title="显示密码" style="cursor:pointer" class="el-icon-view" @click="changePass('show')" />
          </el-input>
        </el-form-item>
        <el-form-item v-else label="密码" prop="passwd">
          <el-input v-model="datasourceform.passwd" placeholder="密码" style="width:60%">
            <i slot="suffix" title="隐藏密码" style="cursor:pointer" class="el-icon-check" @click="changePass('hide')" />
          </el-input>
        </el-form-item>
        <el-form-item label="jdbc url" prop="jdbcurl">
          <el-input
            v-model="datasourceform.jdbcurl"
            placeholder="jdbc url"
            type="textarea"
            :autosize="{minRows: 3, maxRows: 6}"
            style="width:60%"
          />
        </el-form-item>
        <el-form-item label="jdbc驱动类" prop="jdbcdriver">
          <el-input v-model="datasourceform.jdbcdriver" placeholder="jdbc驱动类" style="width:60%" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="datasourceform.description"
            placeholder="描述"
            type="textarea"
            :autosize="{minRows: 2, maxRows: 4}"
            style="width:60%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='new'?createDataSource():updateData()">
          Confirm
        </el-button>
        <el-button type="primary" @click="testDataSource()">
          Test
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as datasourceApi from '../../../api/datax-jdbcDatasource'
import Pagination from '../../../components/Pagination'
Date.prototype.format = function(format) {
  var args = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),  // quarter
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var i in args) {
    var n = args[i]
    if (new RegExp('(' + i + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length)) }
  }
  return format
}
export default {
  components: { Pagination },
  data() {
    return {
      search_data: '',
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        edit: 'Edit',
        new: 'New'
      },
      datasourceform: {
        id: undefined,
        dbname: '',
        description: '',
        host: '',
        port: '',
        user: '',
        passwd: '',
        type: '',
        jdbcurl: '',
        jdbcdriver: ''
      },
      rules: {
        dbname: [{ required: true, message: 'this is required', trigger: 'blur' }],
        host: [{ required: true, message: 'this is required', trigger: 'blur' }],
        port: [{ required: true, message: 'this is required', trigger: 'blur' }],
        user: [{ required: true, message: 'this is required', trigger: 'blur' }],
        passwd: [{ required: true, message: 'this is required', trigger: 'blur' }],
        type: [{ required: true, message: 'this is required', trigger: 'change' }],
        jdbcurl: [{ required: true, message: 'this is required', trigger: 'blur' }],
        jdbcdriver: [{ required: true, message: 'this is required', trigger: 'blur' }]
      },
      dataSources: [
        { value: 'mysql', label: 'mysql' },
        { value: 'oracle', label: 'oracle' },
        { value: 'postgresql', label: 'postgresql' },
        { value: 'sqlserver', label: 'sqlserver' },
        { value: 'hive', label: 'hive' },
        { value: 'hbase', label: 'hbase' }
      ],
      visible: true

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // get the databases list
    fetchData() {
      this.listLoading = true
      datasourceApi.list(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.records
        console.log(this.list)
        this.listLoading = false
      })
    },
    resetForm() {
      this.datasourceform = {
        id: undefined,
        dbname: '',
        description: '',
        host: '',
        port: '',
        user: '',
        passwd: '',
        type: '',
        jdbcurl: '',
        jdbcdriver: ''
      }
    },
    handleSearch() {},
    //click the add
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'new'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    selectDataSource(datasource) {
      if (datasource === 'mysql') {
        this.datasourceform.jdbcurl = 'jdbc:mysql://' + this.datasourceform.host + ':' + this.datasourceform.port + '/' + this.datasourceform.dbname
        this.datasourceform.jdbcdriver = 'com.mysql.jdbc.Driver'
      } else if (datasource === 'oracle') {
        this.datasourceform.jdbcurl = 'jdbc:oracle:thin:@//{host}:{port}/{database}'
        this.datasourceform.jdbcdriver = 'oracle.jdbc.OracleDriver'
      } else if (datasource === 'postgresql') {
        this.datasourceform.jdbcurl = 'jdbc:postgresql://{host}:{port}/{database}'
        this.datasourceform.jdbcdriver = 'org.postgresql.Driver'
      } else if (datasource === 'sqlserver') {
        this.datasourceform.jdbcurl = 'jdbc:sqlserver://{host}:{port};DatabaseName={database}'
        this.datasourceform.jdbcdriver = 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
      } else if (datasource === 'hive') {
        this.datasourceform.jdbcurl = 'jdbc:hive2://{host}:{port}/{database}'
        this.datasourceform.jdbcdriver = 'org.apache.hive.jdbc.HiveDriver'
      }
    },
    //add the new database info
    createDataSource() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const sub_data = this.datasourceform
          const now = new Date()
          sub_data['create_time'] = now.format('yyyy-MM-dd hh:mm:ss')
          sub_data['update_time'] = now.format('yyyy-MM-dd hh:mm:ss')
          datasourceApi.created(sub_data).then(result => {
            if (result.msg == 'ok') {
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
              this.dialogFormVisible = false
            } else {
              this.$notify({
                title: 'Fail',
                message: 'Create Fail',
                type: 'fail',
                duration: 2000
              })
            }
          })
        }
      })
    },
    //test database connection
    testDataSource() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const sub_data = this.datasourceform
          const now = new Date()
          sub_data['create_time'] = now.format('yyyy-MM-dd hh:mm:ss')
          sub_data['update_time'] = now.format('yyyy-MM-dd hh:mm:ss')
          // console.log(this.datasourceform)
          datasourceApi.test(sub_data).then(result => {
            if (result.msg === 'ok') {
              this.$notify({
                title: 'Success',
                message: 'Tested Successfully',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Fail',
                message: 'Tested Fail',
                type: 'fail',
                duration: 2000
              })
            }
          })
        } else {
          console.log('error submit')
        }
      })
    },
    changePass(value) {
      this.visible = !(value === 'show')
    },
    handleUpdate(row) {
      this.datasourceform = Object.assign({}, row)//copy obj
      console.log(this.datasourceform)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.datasourceform) 
          datasourceApi.updated(tempData).then(result => {
             if (result.msg == 'ok') {
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
              this.dialogFormVisible = false
            } else {
              this.$notify({
                title: 'Fail',
                message: 'Update Fail',
                type: 'fail',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      const idList = []
      idList.push(row.id)
      datasourceApi.deleted({idList:row.id}).then(result => {
        if (result.msg == 'ok') {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
              this.dialogFormVisible = false
            } else {
              this.$notify({
                title: 'Fail',
                message: 'Delete Fail',
                type: 'fail',
                duration: 2000
              })
            }
      })
    }
  }
}
</script>
