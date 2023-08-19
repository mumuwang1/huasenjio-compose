/*
 * @Autor: huasenjio
 * @Date: 2022-10-10 00:36:28
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-04-25 00:21:58
 * @Description: 站点表控制器
 */

function findAllByPage(req, res, next) {
  let { pageNo, pageSize, name, code } = req.huasenParams;
  // 模糊查询参数
  let params = { name: { $regex: new RegExp(name) } };
  // 处理权限码模糊查询
  if (code !== '' && code !== undefined && code !== null) {
    params.code = code;
  }
  req.epWorking(
    [
      {
        schemaName: 'Site',
        methodName: 'findAllByPage',
        payloads: [
          {
            $and: [params],
          },
          pageNo,
          pageSize,
        ],
        self: true,
      },
    ],
    result => {
      global.huasen.responseData(res, result, 'SUCCESS', '分页查询站点成功', false);
    },
  );
}

function add(req, res, next) {
  req.epWorking(
    [
      {
        schemaName: 'Site',
        methodName: 'insertMany',
        payloads: [req.huasenParams],
      },
    ],
    result => {
      global.huasen.responseData(res, result, 'SUCCESS', '添加站点成功', false);
    },
  );
}

function addMany(req, res, next) {
  let { sites } = req.huasenParams;
  if (!Array.isArray(sites)) {
    global.huasen.responseData(res, {}, 'ERROR', '导入数据异常', false);
  } else {
    req.epWorking(
      [
        {
          schemaName: 'Site',
          methodName: 'insertMany',
          payloads: [sites],
        },
      ],
      result => {
        global.huasen.responseData(res, result, 'SUCCESS', '导入站点成功', false);
      },
    );
  }
}

function remove(req, res, next) {
  let { _id } = req.huasenParams;
  req.epWorking(
    [
      {
        schemaName: 'Site',
        methodName: 'deleteOne',
        payloads: [
          {
            _id,
          },
        ],
      },
    ],
    result => {
      global.huasen.responseData(res, result, 'SUCCESS', '删除站点成功', false);
    },
  );
}

function removeMany(req, res, next) {
  let { _ids } = req.huasenParams;
  if (!Array.isArray(_ids)) {
    global.huasen.responseData(res, {}, 'ERROR', '参数异常', false);
  } else {
    req.epWorking(
      [
        {
          schemaName: 'Site',
          methodName: 'deleteMany',
          payloads: [{ _id: { $in: _ids } }],
        },
      ],
      result => {
        global.huasen.responseData(res, result, 'SUCCESS', '删除站点成功', false);
      },
    );
  }
}

function update(req, res, next) {
  let { _id } = req.huasenParams;
  req.epWorking(
    [
      {
        schemaName: 'Site',
        methodName: 'updateOne',
        payloads: [{ _id }, { $set: req.huasenParams }, { runValidators: true }],
      },
    ],
    result => {
      global.huasen.responseData(res, result, 'SUCCESS', '更新站点成功', false);
    },
  );
}

// $gt:大于
// $lt:小于
// $gte:大于或等于
// $lte:小于或等于
function findByCode(req, res, next) {
  let { proof } = req.huasenJWT;
  req.epWorking(
    [
      {
        schemaName: 'Site',
        methodName: 'find',
        payloads: [
          {
            // 筛选出小于等于用户权限的订阅源
            code: { $lte: proof.code },
            // 可订阅
            enabled: true,
          },
        ],
      },
    ],
    sites => {
      global.huasen.responseData(res, sites, 'SUCCESS', '查询站点成功', false);
    },
  );
}

function findByList(req, res, next) {
  req.epWorking(
    [
      {
        schemaName: 'Site',
        methodName: 'find',
        payloads: [],
      },
    ],
    sites => {
      global.huasen.responseData(res, sites, 'SUCCESS', '查询站点成功', false);
    },
  );
}

function findSiteTagByList(req, res, next) {
  req.epWorking(
    [
      {
        schemaName: 'Site',
        methodName: 'find',
        payloads: [],
      },
    ],
    sites => {
      let tags = [];
      sites.map(item => {
        try {
          if (!item.expand || item.expand === '{}') return;
          let expandObj = JSON.parse(item.expand);
          if (Array.isArray(expandObj.tag)) {
            tags = tags.concat(expandObj.tag);
          }
        } catch (err) {
          console.log('站点标签解析异常', err);
        }
      });
      // 数据去重
      tags = Array.from(new Set(tags));
      global.huasen.responseData(res, tags, 'SUCCESS', '查询站点成功', false);
    },
  );
}

module.exports = {
  findAllByPage,
  add,
  update,
  remove,
  findByCode,
  findByList,
  removeMany,
  addMany,
  findSiteTagByList,
};
