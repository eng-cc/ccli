import OSS from 'ali-oss';
import { red, yellow } from 'chalk';
import { getCcliState } from '../../cmd/config';
import { resolve } from 'path';
import { OSSLib } from './lib/oss-lib';
export const deployCmd = async (
  target: string,
  opts: { dir?: string; env?: string },
) => {
  const cwd = process.cwd();
  const { dir = './dist', env } = opts;
  const { aliyun, OSS: ossConfig } = getCcliState();
  if (!aliyun?.AccessKey || !aliyun?.AccessKeySecret || !ossConfig?.region) {
    console.log(red('plase config ccli by run: `ccli config`'));
    return;
  }

  const client = new OSS({
    region: ossConfig.region,
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: aliyun.AccessKey,
    accessKeySecret: aliyun.AccessKeySecret,
    // 填写Bucket名称。
    bucket: target,
    secure: true,
    timeout: 1000 * 60,
  });
  const osslib = new OSSLib(client);
  await osslib.uploadFiles({ baseDir: resolve(cwd, dir), namespace: env });
  console.log(yellow('deploy done'));
};
