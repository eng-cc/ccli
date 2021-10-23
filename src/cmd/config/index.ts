import { bgRed, green, red } from 'chalk';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { prompt } from 'inquirer';
// 本地配置文件数据结构，可自行扩展
export interface CcliStateI {
  deployType?: 'static-alioss' | '';
  aliyun?: {
    AccessKey: string;
    AccessKeySecret: string;
  };
  OSS?: {
    region: string;
  };
}

const USER_HOME = process.env.HOME || process.env.USERPROFILE || '';
export const ccliStatePath = resolve(USER_HOME, '.ccli');

export const configCmd = async (reset: boolean) => {
  if (reset) {
    console.log(green('removing ccli config'));
    saveCCliState({});
    return;
  }
  console.log(green('config ccli'));
  const { configType } = await prompt([
    {
      name: 'configType',
      type: 'list',
      message: `choice config item:`,
      choices: [{ name: 'Deploy', value: 'deploy' }],
    },
  ]);
  if (configType === 'deploy') {
    const { deployType } = await prompt([
      {
        name: 'deployType',
        type: 'list',
        message: `choice deploy type:`,
        choices: [{ name: 'aliyun oss static site', value: 'static-alioss' }],
      },
    ]);
    if (deployType === 'static-alioss') {
      const { aliyunAK, aliyunAKS, ossRegion } = await prompt([
        {
          name: 'aliyunAK',
          type: 'input',
          message: `input aliyun AccessKey:`,
        },
        {
          name: 'aliyunAKS',
          type: 'input',
          message: `input aliyun AccessKeySecret:`,
        },
        {
          name: 'ossRegion',
          type: 'input',
          message: `input aliyun oss region:`,
        },
      ]);
      if (aliyunAK && aliyunAKS && ossRegion) {
        saveCCliState({
          deployType: 'static-alioss',
          aliyun: {
            AccessKey: aliyunAK,
            AccessKeySecret: aliyunAKS,
          },
          OSS: {
            region: ossRegion,
          },
        });
        // console.log(green(JSON.stringify(getCcliState())));
      } else {
        console.log(red('plase input aliyunAK && aliyunAKS && ossRegion'));
      }
    }
  }
};

/**
 * 存储state
 * @param state
 */
export const saveCCliState = async (state: Partial<CcliStateI>) => {
  try {
    if (!existsSync(USER_HOME)) {
      mkdirSync(USER_HOME);
    }
    if (!existsSync(ccliStatePath)) {
      writeFileSync(ccliStatePath, '{}');
    }
    const ccliStateStr = readFileSync(ccliStatePath, 'utf8');
    const oldCcliState = JSON.parse(ccliStateStr);
    writeFileSync(ccliStatePath, JSON.stringify({ ...oldCcliState, ...state }));
  } catch (error: any) {
    console.log(red('保存信息失败，请重试'));
    console.log(bgRed('ERROR:'), red(error.message));
    rmSync(ccliStatePath);
    throw error;
  }
};

/**
 * 获取本地配置数据
 */
export const getCcliState = (): CcliStateI => {
  if (!existsSync(USER_HOME)) {
    return {};
  }
  if (!existsSync(ccliStatePath)) {
    return {};
  }
  const ccliStateStr = readFileSync(ccliStatePath, 'utf8');
  const ccliState = JSON.parse(ccliStateStr);
  return ccliState;
};
