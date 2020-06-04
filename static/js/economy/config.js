// 接口配置
var wPath = {
  protocol: 'http://',
  host: '223.84.134.45:18081',
  getPrefix: function(projectName){
    return this.protocol + this.host + '/' + 'situationAwareness';
  },
  getUrl: function(type){
    return this.getPrefix() + (this.uri[type] || '');
  },
  uri: {
    // GET
    // 1.1 首页-各县生产总值，态势图-生产总值
    listGdpEveryDistrictOnYear: '/listGdpEveryDistrictOnYear',
     // 1.2	首页-产业分布
    industrydistribution: '/industrydistribution',
     // 1.3  态势图-财政收入
    listfiscalrevenue: '/listfiscalrevenue',
     // 1.4  1.1	态势图-零售品销售总额
    listretailsales: '/listretailsales',
    // 1.5  态势图-用电量
    electricityconsumption: '/electricityconsumption',
     // 1.6  统计报表-近5年各行业固定资产投资及其增长速度
    industrycomparison: '/industrycomparison',
    // 1.7 统计报表-近5年地区生产总值及其增长速度
    gdpcomparison: '/gdpcomparison',
    // 1.8 统计报表-全市第一、二、三产业分布
    industrydistributionchart: '/industrydistributionchart',
    // 1.9 统计报表-全市第一、二、三各季度统计
    quarterlystatistics: '/quarterlystatistics',
    //1.10 首页-市财政收入
    totalfiscalrevenue:'/totalfiscalrevenue',
  },
};