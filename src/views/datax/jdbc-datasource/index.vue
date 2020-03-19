<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
      v-model = "search_data"
      clearable
      placeholder = "数据源名称"
      />
      <el-button type="primary" @click="handleSearch">Search</el-button>
      <el-button type = "primary" @click="handleCreate">Add</el-button>
    </div>
    <div class=""></div>
    <el-dialog title="新建数据源" :visible.sync = "dialogFormVisible" width = "800px">
      <el-form :model = "datasourceform" :rules = "rules" ref="datasourceform" label-position = "left" label-width = "100px">
        <el-form-item label = "数据源名称"  prop = "dbname">
          <el-input v-model="datasourceform.dbname" placeholder = "数据源名称" style="width:60%"/>
        </el-form-item>
        <el-form-item label = "主机" prop = "host">
          <el-input  v-model = "datasourceform.host" placeholder = "主机" style="width:60%"/>
        </el-form-item>
        <el-form-item label = "端口号" prop = "port">
          <el-input  v-model = "datasourceform.port" placeholder = "端口号" style="width:60%"/>
        </el-form-item>
        <el-form-item label = "数据源类型" prop = "type">
          <el-select v-model="datasourceform.type" placeholder = "数据源类型"  style="width:260px" @change="selectDataSource(datasourceform.type)">
            <el-option v-for="item in dataSources" :key="item.value" :label= "item.label" :value = "item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label = "用户名" prop = "user">
          <el-input  v-model = "datasourceform.user" placeholder = "用户名" style="width:60%"/>
        </el-form-item>
        <el-form-item v-if="visible" label = "密码" prop = "passwd">
          <el-input  v-model = "datasourceform.passwd" placeholder = "密码" style="width:60%">
            <i slot="suffix" title="显示密码" style="cursor:pointer" class="el-icon-view" @click="changePass('show')" />
          </el-input>
        </el-form-item>
        <el-form-item v-else label = "密码" prop = "passwd">
          <el-input  v-model = "datasourceform.passwd" placeholder = "密码" style="width:60%">
            <i slot="suffix" title="隐藏密码" style="cursor:pointer" class="el-icon-check" @click="changePass('hide')" />
          </el-input>
        </el-form-item>
        <el-form-item label = "jdbc url" prop = "jdbc_url">
          <el-input  
            v-model = "datasourceform.jdbc_url" 
            placeholder = "jdbc url" 
            type = "textarea"
            :autosize = "{minRows: 3, maxRows: 6}"
            style="width:60%"/>
        </el-form-item>
        <el-form-item label = "jdbc驱动类" prop = "jdbcdriver">
          <el-input  v-model = "datasourceform.jdbcdriver" placeholder = "jdbc驱动类" style="width:60%"/>
        </el-form-item>
        <el-form-item label = "描述" prop = "description">
          <el-input  
            v-model = "datasourceform.description" 
            placeholder = "描述" 
            type = "textarea"
            :autosize = "{minRows: 2, maxRows: 4}"
            style="width:60%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type = "primary" @click="createDataSource()">
          创建
        </el-button>
        <el-button type = "primary" @click="testDataSource()">
          测试连接
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as datasourceApi from '../../../api/datax-jdbcDatasource'

export default {
  data() {
    return {
      search_data: "",
      dialogFormVisible: false,
      datasourceform: {
        dbname: '',
        description: '',
        host: '',
        port: '',
        user: '',
        passwd: '',
        type: '',
        jdbc_url: '',
        jdbcdriver: ''
      },
       rules: {
        dbname: [{ required: true, message: 'this is required', trigger: 'blur' }],
        host: [{ required: true, message: 'this is required', trigger: 'blur' }],
        port: [{ required: true, message: 'this is required', trigger: 'blur' }],
        user: [{ required: true, message: 'this is required', trigger: 'blur' }],
        passwd: [{ required: true, message: 'this is required', trigger: 'blur' }],
        type: [{ required: true, message: 'this is required', trigger: 'change' }],
        jdbc_url: [{ required: true, message: 'this is required', trigger: 'blur' }],
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
      visible: true,

    }
  },
  methods: {
    handleSearch(){},
    handleCreate() {
      this.dialogFormVisible = true;
    },
    selectDataSource(datasource) {
      if (datasource === 'mysql') {
        this.datasourceform.jdbc_url = 'jdbc:mysql://'+this.datasourceform.host+':'+this.datasourceform.port+'/'+this.datasourceform.dbname
        this.datasourceform.jdbcdriver = 'com.mysql.jdbc.Driver'
      } else if (datasource === 'oracle') {
        this.datasourceform.jdbc_url = 'jdbc:oracle:thin:@//{host}:{port}/{database}'
        this.datasourceform.jdbcdriver = 'oracle.jdbc.OracleDriver'
      } else if (datasource === 'postgresql') {
        this.datasourceform.jdbc_url = 'jdbc:postgresql://{host}:{port}/{database}'
        this.datasourceform.jdbcdriver = 'org.postgresql.Driver'
      } else if (datasource === 'sqlserver') {
        this.datasourceform.jdbc_url = 'jdbc:sqlserver://{host}:{port};DatabaseName={database}'
        this.datasourceform.jdbcdriver = 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
      } else if (datasource === 'hive') {
        this.datasourceform.jdbc_url = 'jdbc:hive2://{host}:{port}/{database}'
        this.datasourceform.jdbcdriver = 'org.apache.hive.jdbc.HiveDriver'
      }
    },
    createDataSource() {

    },
    testDataSource() {
      this.$refs['datasourceform'].validate((valid) => {
        if (valid) {
          let sub_data = this.datasourceform;
          Date.prototype.format = function (format) {
            var args = {
                             "M+": this.getMonth() + 1,
                             "d+": this.getDate(),
                             "h+": this.getHours(),
                             "m+": this.getMinutes(),
                             "s+": this.getSeconds(),
                             "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
                             "S": this.getMilliseconds()
                         };
            if (/(y+)/.test(format))
              format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var i in args) {
              var n = args[i];
              if (new RegExp("(" + i + ")").test(format))
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
            }
            return format;
          };
          let now = new Date();
          sub_data["create_time"] = now.format("yyyy-MM-dd hh:mm:ss")
          sub_data["update_time"] = now.format("yyyy-MM-dd hh:mm:ss")
          console.log(this.datasourceform)
          datasourceApi.test(sub_data).then (result => {
            console.log(result.data)
          })
        }else {
          console.log("error submit")
        }
      })
    },
    changePass(value) {
      this.visible = !(value === 'show')
    }
  },
}
</script>