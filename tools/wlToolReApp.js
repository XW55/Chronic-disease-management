import vueStore from '@/store/index.js';

const cmdArr = ['获取服务失败', '设备地址无效，请先连接设备', 'indexSwave', 'getStorageSync', 'startBluetoothDevicesDiscovery',
  'closeBluetoothAdapter', 'errCode', 'none', 'toString', 'getBLEDeviceCharacteristics', 'abs', 'isSigunsteady',
  'onBLECharacteristicValueChange', 'openBluetoothAdapter', 'deviceId', '请设置微信使用定位权限，用于设备的连接', 'drawDataAry',
  'commit', 'showToast', 'getAppAuthorizeSetting', 'interval', 'length', 'value', 'max', 'exports', 'min',
  '请打开蓝牙，用于设备的连接', 'connected', 'indexOf', 'slice', '974CBE32-3E83-465E-ACDE-6F92FE712134', 'closeBLEConnection',
  'changeBleConnectStatus', 'denied', 'push', '连接超时', 'substr', 'RPeakHeight', 'apply', 'getSystemInfoSync',
  'bluetoothAuthorized', 'locationEnabled', '获取特征值失败', 'platform', 'fill'
];
const getCmdArr = function (val, l2) {
  val = val - 0;
  return cmdArr[val];
};
module.exports = {
  'setCallBack': setCallBack,
  'getECGOriginalData': getECGOriginalData,
  'wlFilter': wlFilter,
  'medianBiquad': medianBiquad,
  'computeECGByTwothousand': computeECGByTwothousand,
  'getDeivceSN': getDeivceSN,
  'openBluetoothAdapter': openBluetoothAdapter,
  'connectBLE': connectBLE,
  'setBLEDataCallback': setBLEDataCallback,
  'closeBLEConnection': closeBLEConnection,
  'startBluetoothDevicesDiscovery': startBluetoothDevicesDiscovery,
  'judgeLocaltion': judgeLocaltion,
  'getBleErrorMessage': getBleErrorMessage
};

let g_pRealTimeFilterFun = null;
let g_pOneMinFun = null;
let g_pointNum = 25;
let g_RealFilterDataAry = [];
let g_FourMinDataAry = [];
let g_deivceSN = '';

function getDeivceSN() {
  return g_deivceSN;
}

function setCallBack(_0x320d11, _0xdfa358, _0x5281a5) {
  g_FourMinDataAry = [];
  for (let _0x399d6f = 0x0; _0x399d6f <
  0x5dc; _0x399d6f++) {
    g_FourMinDataAry['push'](0x0);
  }
  if (g_RealFilterDataAry['length'] < 0x1f4) {
    for (let
           _0x1a93e1 = g_RealFilterDataAry['length']; _0x1a93e1 < 0x1f4; _0x1a93e1++) {
      g_RealFilterDataAry[getCmdArr(
        '0x22')](0x0);
    }
  }
  g_pRealTimeFilterFun = _0x320d11;
  g_pOneMinFun = _0xdfa358;
  if (_0x5281a5) {
    g_pointNum = _0x5281a5;
    g_pointNum = Math[getCmdArr('0x17')](g_pointNum, 0xa);
    g_pointNum = Math[getCmdArr('0x19')](g_pointNum, 0x32);
  }
}

function addOnePackage(_0x498289) {
  let _0x44f06f = [];
  if (_0x498289[0x0] == 0xc0) {
    g_deivceSN = getLocalDeivceSN(
      _0x498289);
    console['log'](g_deivceSN);
    uni.setStorageSync('deviceSN', g_deivceSN)
    vueStore.commit('changeDeviceSNStatus', g_deivceSN)
  } else {
    _0x44f06f = getECGOriginalData(_0x498289);
    if (
      g_pRealTimeFilterFun) {
      g_RealFilterDataAry = g_RealFilterDataAry['concat'](_0x44f06f);
      if (g_RealFilterDataAry[
        'length'] > 0x3e8 + g_pointNum) {
        let _0x1ebef9 = wlFilter(g_RealFilterDataAry);
        g_pRealTimeFilterFun(_0x1ebef9['slice'](0x1c2, 0x1c2 + g_pointNum));
        g_RealFilterDataAry = g_RealFilterDataAry['slice'](g_pointNum);
      }
    }
    if (g_pOneMinFun) {
      g_FourMinDataAry =
        g_FourMinDataAry['concat'](_0x44f06f);
      if (g_FourMinDataAry[getCmdArr('0x15')] > 0x7d0) {
        let _0xe11f24 =
          g_FourMinDataAry['slice'](g_FourMinDataAry['length'] - 0x7d0);
        for (let _0x5df39c = 0x0; _0x5df39c <
        _0xe11f24[getCmdArr('0x15')]; _0x5df39c++) {
          _0xe11f24[_0x5df39c] = _0xe11f24[_0x5df39c] / 0x20;
        }
        let
          _0x18b9d3 = wlFilter(_0xe11f24);
        g_pOneMinFun(computeECGByTwothousand(_0x18b9d3));
        g_FourMinDataAry = g_FourMinDataAry[getCmdArr('0x1d')](0x1f4);
      }
    }
  }
  return _0x44f06f;
}

function getECGOriginalData(_0x3d4480) {
  let _0x2a10e2 = [];
  if (_0x3d4480[0x0] == 0xd3) {
    for (let _0x7e48db =
      0x2; _0x7e48db < 0x14; _0x7e48db = _0x7e48db + 0x3) {
      _0x2a10e2.push(getNumberByThree0HByte(_0x3d4480[
        _0x7e48db], _0x3d4480[_0x7e48db + 0x1], _0x3d4480[_0x7e48db + 0x2]));
    }
  } else if (_0x3d4480[0x0] ===
    0xd2) {
    let _0x3ef330 = getNumberByThree0HByte(_0x3d4480[0x2], _0x3d4480[0x3], _0x3d4480[0x4]);
    _0x2a10e2.push(_0x3ef330);
    let _0xabe796 = _0x3ef330;
    for (let _0x16e308 = 0x5; _0x16e308 <
    0x14; _0x16e308++) {
      _0xabe796 = _0xabe796 + _0x3d4480[_0x16e308] - 0x80;
      _0x2a10e2.push(_0xabe796);
    }
  }
  for (let _0x52b94d = 0x0; _0x52b94d < _0x2a10e2.length; _0x52b94d++) {
    _0x2a10e2[_0x52b94d] = _0x2a10e2[_0x52b94d] * 0x20;
  }
  return _0x2a10e2;
}

function getNumberByThree0HByte(_0x345af5, _0x2033a6, _0x17dfd5) {
  let _0xf92837 = _0x345af5 * 0x100 * 0x100 +
    _0x2033a6 * 0x100 + _0x17dfd5;
  if (_0x345af5 < 0x80) {
    return _0xf92837;
  } else {
    return _0xf92837 - 0x1000000;
  }
}

function get0b(_0x18e31b) {
  let _0x4ffe74 = _0x18e31b[getCmdArr('0x8')](0x2);
  while (_0x4ffe74[getCmdArr('0x15')] <
  0x8) {
    _0x4ffe74 = '0' + _0x4ffe74;
  }
  return _0x4ffe74;
}

/**
 * 获取分析设备SN码
 * @param valArr
 * @returns {string}
 */
function getLocalDeivceSN(valArr) {
  if (valArr.length != 20) {
    return '';
  } else {
    let num = valArr[8] % 16;
    if (num < 10) {
      num = '0' + num;
    } else {
      num = '' + num;
    }
    let str = '';
    for (let i = 3; i < 8; i++) {
      str += get0b(valArr[i]);
    }
    str = parseInt(str, 0x2);
    str += '';
    let sn = str.substr(str['length'] - 0xc, 0x2);
    sn += num;
    let dictionary = ['B', 'C', 'E', 'H', 'M', 'N', 'P', 'S', 'T', 'U'];
    sn += dictionary[Number(str.substr(str.length - 10, 1))];
    sn += dictionary[Number(str.substr(str.length - 9, 1))];
    sn += str.substr(str.length - 8);
    return sn;
  }
}

function mean(_0x11ccc0) {
  if (_0x11ccc0[getCmdArr('0x15')] > 0x0) {
    let _0x467b07 = 0x0;
    for (let _0x36d9c9 =
      0x0; _0x36d9c9 < _0x11ccc0[getCmdArr('0x15')]; _0x36d9c9++) {
      _0x467b07 += _0x11ccc0[
        _0x36d9c9];
    }
    return _0x467b07 / _0x11ccc0[getCmdArr('0x15')];
  } else {
    return 0x0;
  }
}

function wlvar(_0x204d57) {
  if (_0x204d57[getCmdArr('0x15')] > 0x1) {
    let _0x4a77d7 = mean(_0x204d57);
    let _0x2de3a6 =
      0x0;
    for (let _0x5c178b = 0x0; _0x5c178b < _0x204d57['length']; _0x5c178b++) {
      _0x2de3a6 += Math['pow'](_0x204d57[
        _0x5c178b] - _0x4a77d7, 0x2);
    }
    return _0x2de3a6 / (_0x204d57['length'] - 0x1);
  } else {
    return 0x0;
  }
}

function computeECGByTwothousand(_0x2bac3f) {
  const _0x170688 = 0x3e8;
  const _0x221d1f = 0x2ee;
  let _0x7411aa =
    new Array(_0x170688)['fill'](0x0);
  for (let _0x166475 = 0x0; _0x166475 < _0x170688; _0x166475++) {
    _0x7411aa[
      _0x166475] = _0x2bac3f[_0x166475 * 0x2];
  }
  let _0xd09b24 = 0x19;
  let _0x550b05 = medianBiquad(_0x7411aa,
    0x14);
  let _0x37c996 = medianBiquad(_0x7411aa, 0x32);
  let _0x3ec23f = medianBiquad(_0x7411aa, 0xa);
  let
    _0x2c3cfd = {
      'isSigunsteady':
        ![],
      'meanHR': 0x0,
      'secondSteady': 0x0,
      'RPeakHeight': 0x0,
      'SwaveMinHeight': 0x0,
      'drawDataAry': new Array(_0x221d1f)[
        getCmdArr('0x2c')](0x0)
    };
  let _0x2e8e0f = [];
  let _0xd12a91 = [];
  _0x2c3cfd[getCmdArr('0xb')] = computeSigunsteady(_0x7411aa['slice'](0xfa - _0xd09b24, 0x3e8 - _0xd09b24), _0x3ec23f[
    'slice'](0xfa - _0xd09b24, 0x3e8 - _0xd09b24));
  let _0x4f384f = computeHRinterval(_0x7411aa['slice'](0xfa -
    _0xd09b24, 0x3e8 - _0xd09b24), _0x550b05[getCmdArr('0x1d')](0xfa - _0xd09b24, 0x3e8 - _0xd09b24));
  _0x2e8e0f = _0x4f384f['indexPeak'];
  _0xd12a91 = _0x4f384f[getCmdArr('0x2')];
  if (_0x4f384f['interval'] > 0x2) {
    _0x2c3cfd['meanHR'] = Number((0x3a98 /
      _0x4f384f[getCmdArr('0x14')])['toFixed'](0x1));
  }
  if (_0x2e8e0f.length > 0) {
    let _0x53253d = smooth_shipR(
      _0x37c996[getCmdArr('0x1d')](0xfa - _0xd09b24, 0x3e8 - _0xd09b24), _0x2e8e0f, 0xf, 0x7, 0x7);
    for (let _0x2acf83 =
      0x0; _0x2acf83 < _0x221d1f; _0x2acf83++) {
      _0x2c3cfd['drawDataAry'][_0x2acf83] = _0x53253d[
        _0x2acf83];
    }
    _0x2c3cfd[getCmdArr('0x25')] = 0x0;
    for (const _0x4ece47 of _0x2e8e0f) {
      _0x2c3cfd[getCmdArr('0x25')] =
        Math[getCmdArr('0x17')](_0x2c3cfd['RPeakHeight'], _0x53253d[_0x4ece47]);
    }
    _0x2c3cfd['SwaveMinHeight'] =
      0x0;
    for (const _0x163e3d of _0xd12a91) {
      _0x2c3cfd['SwaveMinHeight'] = Math[getCmdArr('0x19')](_0x2c3cfd[
        'SwaveMinHeight'], _0x53253d[_0x163e3d]);
    }
  } else {
    for (let _0x1e965c = 0x0; _0x1e965c <
    _0x221d1f; _0x1e965c++) {
      _0x2c3cfd[getCmdArr('0x10')][_0x1e965c] = _0x37c996[_0x1e965c + 0xfa -
      _0xd09b24];
    }
  }
  return _0x2c3cfd;
}

function computeSigunsteady(_0x33c78c, _0x421fb2) {
  let _0x37e996 = 0x0;
  for (let _0x1292c7 = 0x0; _0x1292c7 <
  _0x33c78c[getCmdArr('0x15')]; _0x1292c7++) {
    _0x37e996 = Math[getCmdArr('0x17')](Math[getCmdArr('0xa')](_0x421fb2[
      _0x1292c7] - _0x33c78c[_0x1292c7]), _0x37e996);
  }
  return _0x37e996 > 0x3e8 ? !![] : ![];
}

function computeHRinterval(_0x1ec1ed, _0x4b8caf) {
  let _0x11aa00 = new Array(_0x4b8caf[getCmdArr('0x15')])[getCmdArr(
    '0x2c')](0x0);
  let _0x108ee0 = 0x4;
  for (let _0x177f66 = _0x108ee0; _0x177f66 < _0x4b8caf['length'] -
  _0x108ee0; _0x177f66++) {
    _0x11aa00[_0x177f66] = _0x4b8caf[_0x177f66] - _0x4b8caf[_0x177f66 + _0x108ee0];
  }
  let
    _0x41c20b = 0x7;
  let _0x2f12b6 = new Array(_0x4b8caf['length'])[getCmdArr('0x2c')](0x0);
  for (let _0x3a07b8 =
    _0x41c20b; _0x3a07b8 < _0x11aa00[getCmdArr('0x15')] - _0x41c20b; _0x3a07b8++) {
    _0x2f12b6[_0x3a07b8] = _0x11aa00[
      _0x3a07b8] - _0x11aa00[_0x3a07b8 - _0x41c20b];
  }
  let _0x3300aa = Math[getCmdArr('0x17')][getCmdArr('0x26')](null,
    _0x2f12b6) * 0.4;
  _0x3300aa = Math['min'](_0x3300aa, 0x1f4);
  let _0x3ae5fc = Math[getCmdArr('0x17')](0x50, _0x3300aa);
  let
    _0x36aa63 = [];
  let _0x3d3b65 = [];
  let _0x3ad6f7 = -0x2710;
  let _0x26702c = 0x7;
  for (let _0x4852a0 =
    _0x26702c; _0x4852a0 < _0x2f12b6['length'] - _0x26702c; _0x4852a0++) {
    if (_0x2f12b6[_0x4852a0] > _0x3ae5fc &&
      _0x2f12b6[_0x4852a0] >= _0x2f12b6[_0x4852a0 - 0x1] && _0x2f12b6[_0x4852a0] >= _0x2f12b6[_0x4852a0 + 0x1] &&
      _0x4852a0 - _0x3ad6f7 > 0x3c) {
      let _0x1bcdbd = ![];
      let _0x4448e9 = _0x4852a0;
      let _0x1744c6 = -0x3e8;
      for (let
             _0x2e3e54 = -_0x26702c; _0x2e3e54 < _0x26702c; _0x2e3e54++) {
        if (_0x1ec1ed[_0x4852a0 - _0x2e3e54] >=
          _0x1ec1ed[_0x4852a0 - _0x2e3e54 - 0x1] && _0x1ec1ed[_0x4852a0 - _0x2e3e54] >= _0x1ec1ed[_0x4852a0 -
          _0x2e3e54 + 0x1]) {
          _0x1bcdbd = !![];
          if (_0x1744c6 < _0x1ec1ed[_0x4852a0 - _0x2e3e54]) {
            _0x4448e9 =
              _0x4852a0 - _0x2e3e54;
            _0x1744c6 = _0x1ec1ed[_0x4448e9];
          }
        }
      }
      if (_0x1bcdbd) {
        _0x36aa63[getCmdArr('0x22')](_0x4448e9);
        _0x3ad6f7 = _0x4448e9;
        for (let _0x36d5e3 = 0x0; _0x36d5e3 < 0x2 * _0x26702c; _0x36d5e3++) {
          if (_0x1ec1ed[
            _0x4852a0 + _0x36d5e3] <= _0x1ec1ed[_0x4852a0 + _0x36d5e3 - 0x1] && _0x1ec1ed[_0x4852a0 + _0x36d5e3] <=
            _0x1ec1ed[_0x4852a0 + _0x36d5e3 + 0x1]) {
            _0x3d3b65[getCmdArr('0x22')](_0x4852a0 +
              _0x36d5e3);
            break;
          }
        }
      }
    }
  }
  let _0x316d81 = ![];
  let _0x3110bd = 0x0;
  let _0x103e14 = 0x1e;
  if (_0x36aa63[
    'length'] > 0x0) {
    for (let _0x1e15ce = 0x0; _0x1e15ce < _0x36aa63[getCmdArr('0x15')]; _0x1e15ce++) {
      let
        _0x1ff0ca = Math['max'](_0x36aa63[_0x1e15ce] - _0x103e14, 0x0);
      let _0x24d57f = Math[getCmdArr('0x19')](_0x36aa63[
        _0x1e15ce] + _0x103e14, _0x2f12b6['length']);
      for (let _0x21e008 = _0x1ff0ca; _0x21e008 <
      _0x24d57f; _0x21e008++) {
        _0x2f12b6[_0x21e008] = 0x0;
      }
    }
    _0x3110bd = _0x3300aa / Math['sqrt'](wlvar(
      _0x2f12b6));
    if (_0x3110bd > 0x2 && _0x3300aa > 0x32) {
      _0x316d81 = !![];
    }
  }
  let _0x4afd79 = 0x0;
  if (_0x36aa63[
    getCmdArr('0x15')] > 0x2) {
    let _0x2460a7 = [];
    for (let _0x35b228 = 0x1; _0x35b228 < _0x36aa63[getCmdArr(
      '0x15')]; _0x35b228++) {
      _0x2460a7[getCmdArr('0x22')](_0x36aa63[_0x35b228] - _0x36aa63[_0x35b228 - 0x1]);
    }
    let
      _0x393931 = Math[getCmdArr('0x17')]['apply'](null, _0x2460a7);
    let _0x464e60 = Math[getCmdArr('0x19')]['apply'](null,
      _0x2460a7);
    if (_0x393931 / _0x464e60 < 1.35) {
      _0x4afd79 = (_0x36aa63[_0x36aa63['length'] - 0x1] - _0x36aa63[
        0x0]) / (_0x36aa63['length'] - 0x1);
    }
  } else if (_0x36aa63[getCmdArr('0x15')] === 0x2) {
    _0x4afd79 = _0x36aa63[
      0x1] - _0x36aa63[0x0];
    if (_0x4afd79 < 0xc8 || _0x4afd79 > 0x190) {
      _0x4afd79 = 0x0;
    }
  }
  if (!
    _0x316d81) {
    _0x4afd79 = 0x0;
  }
  return {'interval': _0x4afd79, 'indexPeak': _0x36aa63, 'indexSwave': _0x3d3b65};
}

function smooth_shipR(_0x131016, _0x4bff5d, _0xc45954, _0x1b5019, _0x1527c9) {
  let _0x27605c = Math['ceil'](_0xc45954 /
    0x2);
  let _0x3d23e0 = 0x0;
  let _0x196de5 = 0x0;
  let [..._0x7930bc] = _0x131016;
  let _0x377985 = 0x0;
  if (_0x4bff5d[
    _0x196de5] < _0x1b5019) {
    _0x3d23e0 = _0x4bff5d[_0x196de5] + _0x1527c9;
    _0x196de5 = 0x1;
  }
  while (_0x3d23e0 < _0x131016[getCmdArr('0x15')]) {
    if (_0x196de5 < _0x4bff5d[getCmdArr('0x15')] &&
      _0x3d23e0 + _0x377985 >= _0x4bff5d[_0x196de5] - _0x1b5019) {
      if (_0x377985 >= 0x1) {
        _0x377985 = _0x377985 -
          0x1;
      } else {
        _0x3d23e0 = _0x3d23e0 + _0x1b5019 + _0x1527c9;
        _0x196de5 = _0x196de5 + 0x1;
        if (_0x3d23e0 > _0x131016['length']) {
          break;
        }
      }
      _0x7930bc[_0x3d23e0] = mean(
        _0x131016['slice'](_0x3d23e0 - _0x377985, _0x3d23e0 + _0x377985 + 0x1));
    } else if (_0x3d23e0 + _0x377985 >=
      _0x131016[getCmdArr('0x15')]) {
      if (_0x377985 >= 0x1) {
        _0x377985 = _0x377985 - 0x1;
      } else {
        break;
      }
      _0x7930bc[
        _0x3d23e0] = mean(_0x131016[getCmdArr('0x1d')](_0x3d23e0 - _0x377985, _0x3d23e0 + _0x377985 +
        0x1));
    } else {
      _0x7930bc[_0x3d23e0] = mean(_0x131016[getCmdArr('0x1d')](_0x3d23e0 - _0x377985, _0x3d23e0 +
        _0x377985 + 0x1));
      _0x377985 = Math[getCmdArr('0x19')](_0x377985 + 0x1, _0x27605c);
    }
    _0x3d23e0 = _0x3d23e0 +
      0x1;
  }
  return _0x7930bc;
}

let temp_all = [
  [0x0, 0x0],
  [0x0, 0x0],
  [0x0, 0x0],
  [0x0, 0x0],
  [0x0, 0x0],
  [0x0, 0x0],
  [0x0, 0x0],
  [0x0, 0x0],
  [0x0, 0x0]
];

function wlFilter(_0x208a93) {
  let _0x55d56e = wlphasefilt(_0x208a93);
  let _0x7dafc2 = wlcommonfilt(_0x55d56e, !
    ![]);
  return wlcommonfilt(_0x7dafc2, ![]);
}

function iir_stream_all(_0x8c981d, _0x3b944a, _0x391e11, _0x47236e, _0x49e2d9, _0x1376a3) {
  let _0xdfdbb =
    _0x8c981d;
  let _0x4337bb = _0x3b944a;
  let _0x1e41d6 = _0x391e11;
  for (let _0x3a749e = 0x0; _0x3a749e <
  _0x1376a3; _0x3a749e++) {
    let _0x12c429 = temp_all[_0x3a749e][0x0];
    let _0x4818a2 = temp_all[_0x3a749e][0x1];
    _0x1e41d6 = _0x49e2d9[_0x3a749e] * (_0x1e41d6 * _0x47236e[_0x3a749e][0x0] + _0x4337bb * _0x47236e[_0x3a749e][0x1] +
      _0xdfdbb * _0x47236e[_0x3a749e][0x2]) - _0x4818a2 * _0x47236e[_0x3a749e][0x4] - _0x12c429 * _0x47236e[_0x3a749e]
      [0x5];
    _0xdfdbb = _0x12c429;
    _0x4337bb = _0x4818a2;
    temp_all[_0x3a749e][0x0] = _0x4818a2;
    temp_all[_0x3a749e][0x1] = _0x1e41d6;
  }
  return _0x1e41d6;
}

function wlcommonfilt(_0x34a0d7, _0x1690de) {
  let _0x445754 = [0.9911535951016633, 0.9681522377236349,
    0.9681522377236349, 0.9408092961815946, 0.05499010707291403, 0.04613180209331293, 0.04220640333661781
  ];
  let _0x5ad863 = [
    [0x1, -0x2, 0x1, 0x1, -1.982228929792528, 0.9823854506141251],
    [0x1, -1.621233121980644, 0x1, 0x1, -1.501787337686438, 0.9347547531033475],
    [0x1, -1.621233121980644, 0x1, 0x1, -1.633042983240282, 0.9436248404806153],
    [0x1, -1.621233121980644, 0x1, 0x1, -1.525271192436899, 0.8816185923631893],
    [0x1, 0x2, 0x1, 0x1, -1.558312063461799, 0.7782724917534555],
    [0x1, 0x2, 0x1, 0x1, -1.307285028849323, 0.4918122372225753],
    [0x1, 0x2, 0x1, 0x1, -1.196046906902314, 0.3648725202487851]
  ];
  return wlbasecommonfilt(_0x34a0d7, _0x1690de, _0x5ad863, _0x445754, 0x7);
}

function wlbasecommonfilt(_0x3ecb85, _0x2cf762, _0x312819, _0x1e3f7f, _0x293a9d) {
  let _0x41cc89 = [0x0, 0x0,
    0x0];
  for (let _0x1fb330 = 0x0; _0x1fb330 < _0x293a9d; _0x1fb330++) {
    temp_all[_0x1fb330][0x0] = 0x0;
    temp_all[_0x1fb330][0x1] = 0x0;
  }
  let _0x1dbc4a = new Array(_0x3ecb85['length']);
  if (_0x2cf762) {
    for (let
           _0x4ff8ec = 0x0; _0x4ff8ec < _0x3ecb85[getCmdArr('0x15')]; _0x4ff8ec++) {
      if (_0x4ff8ec == 0x0) {
        _0x41cc89[0x0] =
          _0x3ecb85[_0x4ff8ec];
        _0x41cc89[0x1] = _0x3ecb85[_0x4ff8ec];
        _0x41cc89[0x2] = _0x3ecb85[_0x4ff8ec];
      } else if (_0x4ff8ec == 0x1) {
        _0x41cc89[0x0] = _0x3ecb85[_0x4ff8ec -
        0x1];
        _0x41cc89[0x1] = _0x3ecb85[_0x4ff8ec - 0x1];
        _0x41cc89[0x2] = _0x3ecb85[_0x4ff8ec];
      } else {
        _0x41cc89[0x0] = _0x3ecb85[_0x4ff8ec - 0x2];
        _0x41cc89[0x1] = _0x3ecb85[_0x4ff8ec - 0x1];
        _0x41cc89[0x2] = _0x3ecb85[_0x4ff8ec];
      }
      _0x1dbc4a[_0x4ff8ec] = iir_stream_all(_0x41cc89[0x0], _0x41cc89[0x1],
        _0x41cc89[0x2], _0x312819, _0x1e3f7f, _0x293a9d);
    }
  } else {
    for (let _0x23d0db = _0x3ecb85[getCmdArr('0x15')] -
      0x1; _0x23d0db >= 0x0; _0x23d0db--) {
      if (_0x23d0db == _0x3ecb85[getCmdArr('0x15')] - 0x1) {
        _0x41cc89[0x0] =
          _0x3ecb85[_0x23d0db];
        _0x41cc89[0x1] = _0x3ecb85[_0x23d0db];
        _0x41cc89[0x2] = _0x3ecb85[_0x23d0db];
      } else if (_0x23d0db == _0x3ecb85['length'] - 0x2) {
        _0x41cc89[0x0] =
          _0x3ecb85[_0x23d0db + 0x1];
        _0x41cc89[0x1] = _0x3ecb85[_0x23d0db + 0x1];
        _0x41cc89[0x2] = _0x3ecb85[_0x23d0db];
      } else {
        _0x41cc89[0x0] = _0x3ecb85[_0x23d0db + 0x2];
        _0x41cc89[0x1] = _0x3ecb85[_0x23d0db + 0x1];
        _0x41cc89[0x2] = _0x3ecb85[_0x23d0db];
      }
      _0x1dbc4a[_0x23d0db] = iir_stream_all(_0x41cc89[0x0], _0x41cc89[0x1],
        _0x41cc89[0x2], _0x312819, _0x1e3f7f, _0x293a9d);
    }
  }
  return _0x1dbc4a;
}

/**
 * 滤波
 * @param valArr
 * @returns {any[]}
 */
function wlphasefilt(_0x953224) {
  let _0x3fa35a = new Array(_0x953224['length']);
  let _0x523f3c = [0x0, 0x0, 0x0];
  let
    _0x150ff2 = [0.9987449394335488];
  let _0x3bf2f9 = [
    [0x1, -0x1, 0x0, 0x1, -0.9974898788670975, 0x0]
  ];
  for (let _0x3921f5 = 0x0; _0x3921f5 < 0x1; _0x3921f5++) {
    temp_all[_0x3921f5][0x0] = 0x0;
    temp_all[_0x3921f5][0x1] = 0x0;
  }
  for (let _0x4fdbea = _0x953224['length'] - 0x1; _0x4fdbea >=
  0x0; _0x4fdbea--) {
    if (_0x4fdbea == _0x953224[getCmdArr('0x15')] - 0x1) {
      _0x523f3c[0x0] = _0x953224[_0x4fdbea];
      _0x523f3c[0x1] = _0x953224[_0x4fdbea];
      _0x523f3c[0x2] = _0x953224[_0x4fdbea];
    } else if (_0x4fdbea == _0x953224[getCmdArr('0x15')] - 0x2) {
      _0x523f3c[
        0x0] = _0x953224[_0x4fdbea + 0x1];
      _0x523f3c[0x1] = _0x953224[_0x4fdbea + 0x1];
      _0x523f3c[0x2] = _0x953224[_0x4fdbea];
    } else {
      _0x523f3c[0x0] = _0x953224[_0x4fdbea + 0x2];
      _0x523f3c[0x1] = _0x953224[_0x4fdbea + 0x1];
      _0x523f3c[0x2] = _0x953224[_0x4fdbea];
    }
    _0x3fa35a[_0x4fdbea] = iir_stream_all(_0x523f3c[0x0], _0x523f3c[0x1],
      _0x523f3c[0x2], _0x3bf2f9, _0x150ff2, 0x1);
  }
  return _0x3fa35a;
}

/**
 * 求平均值
 * @param valArr
 * @param valNum
 * @returns {*|*[]}
 */
function medianBiquad(_0x7e8c8e, _0x1486ad) {
  if (_0x7e8c8e['length'] < _0x1486ad) {
    return _0x7e8c8e;
  }
  let
    _0x270a15 = [];
  for (let _0x26412b = 0x0; _0x26412b < _0x1486ad; _0x26412b++) {
    _0x270a15['push'](_0x7e8c8e[
      _0x26412b]);
  }
  for (let _0x200da1 = 0x0; _0x200da1 < _0x7e8c8e[getCmdArr('0x15')]; _0x200da1++) {
    _0x270a15['push'](
      _0x7e8c8e[_0x200da1]);
  }
  for (let _0x4ee4bf = 0x0; _0x4ee4bf < _0x1486ad; _0x4ee4bf++) {
    _0x270a15[getCmdArr(
      '0x22')](_0x7e8c8e[_0x7e8c8e[getCmdArr('0x15')] - _0x1486ad + _0x4ee4bf]);
  }
  let _0x2de364 = [];
  for (let _0x4548d =
    0x0; _0x4548d < 0x2 * _0x1486ad + 0x1; _0x4548d++) {
    _0x2de364[getCmdArr('0x22')](_0x270a15[_0x4548d]);
  }
  _0x2de364[
    'sort']((_0x11bd31, _0x13a501) => _0x11bd31 - _0x13a501);
  let _0x58e173 = [];
  for (let _0x5893a1 = 0x0; _0x5893a1 <
  _0x7e8c8e['length'] - 0x1; _0x5893a1++) {
    _0x58e173['push'](_0x7e8c8e[_0x5893a1] - _0x2de364[_0x1486ad]);
    let
      _0x449a99 = _0x2de364[getCmdArr('0x1c')](_0x270a15[_0x5893a1]);
    _0x2de364['splice'](_0x449a99, 0x1);
    let _0x34f7b5 = _0x270a15[_0x5893a1 + 0x2 * _0x1486ad + 0x1];
    let _0x3bca32 =
      0x0;
    for (_0x3bca32 = 0x0; _0x3bca32 < _0x2de364['length']; _0x3bca32++) {
      if (_0x2de364[_0x3bca32] <
        _0x34f7b5) {
        continue;
      }
      break;
    }
    _0x2de364['splice'](_0x3bca32, 0x0, _0x34f7b5);
  }
  _0x58e173['push'](_0x7e8c8e[
  _0x7e8c8e[getCmdArr('0x15')] - 0x1] - _0x2de364[_0x1486ad]);
  return _0x58e173;
}


let g_wlBLE_Max_connectTimes = 5;
let g_wlBLE_connectTimes = 0;
let g_wlBLE_FinshCallback = null;
let g_wlBLE_ConnectCallback = null;
let g_wlBLE_DataCallback = null;

function setBLEDataCallback(wlBLE_DataCallback) {
  g_wlBLE_DataCallback = wlBLE_DataCallback;
}

/**
 * 连接蓝牙
 * @param times
 * @param finshCallback
 * @param connectCallback
 */
function connectBLE(times, finshCallback, connectCallback) {
  if (times) {
    g_wlBLE_Max_connectTimes = times;
  } else {
    g_wlBLE_Max_connectTimes = 5;
  }
  g_wlBLE_connectTimes = 1;
  g_wlBLE_FinshCallback = finshCallback;
  g_wlBLE_ConnectCallback = connectCallback;
  let deviceId = uni.getStorageSync('deviceId');
  WLConnectBLE(deviceId, connectResult);
}

/**
 * 连接蓝牙
 * @param deviceId
 * @param WLConnectBLECallBack
 * @constructor
 */
function WLConnectBLE(deviceId, WLConnectBLECallBack) {
  onlyConnect(deviceId, function (res) {
    console.log('连接蓝牙')
    console.log(res)
    if (res.errCode === 10000) {
      openBluetoothAdapter(function (res2) {
        if (res2.errCode === 0) {
          WLConnectBLE(deviceId, WLConnectBLECallBack);
        } else {
          WLConnectBLECallBack(res2);
        }
      });
    } else {
      WLConnectBLECallBack(res);
    }
  });
}

/**
 * 连接蓝牙
 * @param data
 */
function connectResult(data) {
  if (g_wlBLE_ConnectCallback) {
    g_wlBLE_ConnectCallback({
      errCode: data.errCode,
      connectTimes: g_wlBLE_connectTimes
    });
  }

  g_wlBLE_connectTimes++;

  if (g_wlBLE_connectTimes >= g_wlBLE_Max_connectTimes) {
    if (g_wlBLE_FinshCallback) {
      g_wlBLE_FinshCallback(data);
    }
  } else {
    let errCode = data.errCode;
    if (errCode === 0 || errCode === -1) {
      let deviceId = uni.getStorageSync('deviceId');
      notifyBLECharacteristicValueChange(deviceId, dealCharacteristicValueChangeRes);
    } else if (errCode === 10004 || errCode === 10005) {
      uni.closeBluetoothAdapter({
        complete: (res) => {
          // todo 这里报错
          WLConnectBLE(connectResult);
        }
      });
    } else if (errCode === 10013 || errCode === 10001 || errCode === undefined) {
      if (g_wlBLE_FinshCallback) {
        g_wlBLE_FinshCallback(data);
      }
    } else {
      WLConnectBLE(connectResult);
    }
  }
}

/**
 * 启用低功耗蓝牙设备特征值变化时的notify功能，订阅特征值
 * @param data
 */
function dealCharacteristicValueChangeRes(data) {
  if (data.errCode === 0) {
    uni.onBLECharacteristicValueChange(function (res) {
        let unit8Arr = new Uint8Array(res.value);
        if (g_wlBLE_DataCallback) {
          g_wlBLE_DataCallback(unit8Arr);
        }
        addOnePackage(unit8Arr);
      }
    );
  }
  g_wlBLE_FinshCallback(data);
}

/*
  * 非正常情况下关闭蓝牙连接
  * @param callback 回调函数
 */
function closeBLEConnection(closeBLEConnectionCallback) {
  let deviceId = uni.getStorageSync("deviceId")
  if (deviceId) {
    uni.closeBLEConnection({
      deviceId: deviceId,
      success: (res) => {
        vueStore.commit('changeBleConnectStatus', false);
        vueStore.commit('changeDeviceSNStatus', '')
      },
      complete: (info) => {
        uni.closeBluetoothAdapter({
          complete: (info1) => {
            if (closeBLEConnectionCallback) {
              closeBLEConnectionCallback(info1);
            }
          }
        });
      }
    });
  } else {
    if (closeBLEConnectionCallback) {
      closeBLEConnectionCallback({errCode: 0});
    }
  }
}

const serviceId = '974CBE30-3E83-465E-ACDE-6F92FE712134';
const characteristicId = '974CBE31-3E83-465E-ACDE-6F92FE712134';
const characteristicIdWrite = '974CBE32-3E83-465E-ACDE-6F92FE712134';

/**
 * 打开蓝牙
 * @param openBluetoothAdapterCallback 回调函数
 */
function openBluetoothAdapter(openBluetoothAdapterCallback) {
  uni.openBluetoothAdapter({
    success: (res) => {
      uni.onBLEConnectionStateChange(function (res2) {
        // if (!res2.deviceId === uni.getStorageSync('deviceId')) {
        console.log('触发到这里')
        console.log(res2)
        vueStore.commit('changeBleConnectStatus', res2.connected)
        // }
      });
      openBluetoothAdapterCallback({errCode: 0});
    },
    fail: (err) => {
      openBluetoothAdapterCallback({
        errCode: err.errCode
      });
    }
  });
}

/**
 * 只连接蓝牙
 * @param deviceId
 * @param onlyConnectCallback
 */
function onlyConnect(deviceId, onlyConnectCallback) {
  uni.createBLEConnection({
    deviceId: deviceId,
    timeout: 5000,
    success: (res) => {
      getWLBLEDeviceServices(deviceId, 0, onlyConnectCallback);
    },
    fail: (err) => {
      if (err.errCode === -1) {
        getWLBLEDeviceServices(deviceId, -1, onlyConnectCallback);
      } else {
        onlyConnectCallback(err);
      }
    }
  });
}

/**
 * 启用低功耗蓝牙设备特征值变化时的notify功能，订阅特征值
 * @param deviceIdVal 设备id
 * @param notifyBLECharacteristicValueChangeCallback 回调函数
 */
function notifyBLECharacteristicValueChange(deviceIdVal, notifyBLECharacteristicValueChangeCallback) {
  uni.notifyBLECharacteristicValueChange({
    state: true,
    deviceId: deviceIdVal,
    serviceId: serviceId,
    characteristicId: characteristicId,
    success: (res) => {
      notifyBLECharacteristicValueChangeCallback({errCode: 0});
    }, fail: (err) => {
      notifyBLECharacteristicValueChangeCallback(err);
    }
  });
}

/**
 * 获取蓝牙设备的所有服务
 * @param deviceId 设备id
 * @param errCode 错误码
 * @param getWLBLEDeviceServicesCallback 回调函数
 */
function getWLBLEDeviceServices(deviceId, errCode, getWLBLEDeviceServicesCallback) {
  setTimeout(function () {
    uni.getBLEDeviceServices({
      deviceId,
      success(res) {
        console.log('获取服务成功')
        console.log(res)
        uni.getBLEDeviceCharacteristics({
          deviceId,
          serviceId,
          success(res) {
            console.log('获取特征值成功')
            getWLBLEDeviceServicesCallback({
              errCode: errCode
            })
          },
          fail(err) {
            console.log('获取特征值失败')
            console.log(err)
            getWLBLEDeviceServicesCallback(err)
          }
        })
      },
      fail(err) {
        console.log('获取服务失败')
        getWLBLEDeviceServicesCallback(err)
      }
    })
  },2000)
}

/**
 * 启用蓝牙
 */
function startBluetoothDevicesDiscovery() {
  return new Promise((resolve, reject) => {
    openBluetoothAdapter(function (res) {
      if (res.errCode === 0) {
        uni.startBluetoothDevicesDiscovery({
          powerLevel: 'high',
          success(res) {
            resolve(res);
          },
          fail(res1) {
            uni.showToast({
              title: '蓝牙搜索失败',
              icon: 'none',
              duration: 3000
            })
            reject(res1);
          }
        })
      } else {
        reject(res);
      }
    })
  })
}

/**
 * 获取蓝牙设备列表
 * @returns {boolean}
 */
function judgeLocaltion() {
  let sysInfo = uni.getSystemInfoSync();
  console.log(sysInfo)
  // #ifdef MP-WEIXIN
  if (!sysInfo.bluetoothEnabled) {
    if (sysInfo.platform === 'ios') {
      let AppAuth = uni.getAppAuthorizeSetting();
      if (AppAuth.bluetoothAuthorized == "denied") {
        uni.showToast({title: '请设置微信使用蓝牙权限，用于设备的连接', icon: 'none', duration: 3000});
        return false;
      }
    }
    uni.showToast({title: '请打开蓝牙，用于设备的连接', icon: 'none', duration: 3000});
    return false;
  }
  // #endif
  if (sysInfo.platform == 'ios') {
    return true;
  }
  // #ifdef MP-WEIXIN
  if (sysInfo.locationAuthorized) {
    if (sysInfo.locationEnabled) {
      return true;
    } else {
      uni.showToast({title: '请开启定位功能，用于设备的连接', icon: 'none', duration: 3000});
      return false;
    }
  } else {
    uni.showToast({title: '请设置微信使用定位权限，用于设备的连接', icon: 'none', duration: 3000});
    return false;
  }
  // #endif
  // #ifdef APP-PLUS
  let systemType = uni.getSystemInfoSync().platform;
  // 安卓
  if (systemType === 'android') {
    var context = plus.android.importClass('android.content.Context');
    var locationManager = plus.android.importClass('android.location.LocationManager');
    var main = plus.android.runtimeMainActivity();
    var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
    if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
      uni.showModal({
        title: '提示',
        content: '请打开定位服务功能',
        showCancel: false,
        success() {
          if (!mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
            var Intent = plus.android.importClass('android.content.Intent');
            var Settings = plus.android.importClass('android.provider.Settings');
            var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            main.startActivity(intent); // 打开系统设置定位服务功能页面
          } else {
            console.log('定位服务功能已开启');
          }
        }
      });
    }
  }

  // #endif
  return true
}

function getBleErrorMessage(errCode) {
  if (errCode === 10001) {
    return "请打开蓝牙"
  } else if (errCode === 10003) {
    return "连接设备失败"
  } else if (errCode === 10004) {
    return "获取服务失败"
  } else if (errCode === 10005) {
    return "获取特征值失败"
  } else if (errCode === 10012) {
    return "连接超时"
  } else if (errCode === 10013) {
    return "设备地址无效，请先连接设备"
  } else {
    return "连接错误，错误码为：" + errCode
  }
}

