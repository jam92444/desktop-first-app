import osUtils from "os-utils";
import fs from "fs";
import os from "os";

const POOLING_INTERVAL = 500;

export const poolResource = () => {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    console.log({ cpuUsage, ramUsage, storageData: storageData.usage });
  }, POOLING_INTERVAL);
};

export const gatStaticData = () => {
  const totalStorage = getStorageData().total;
  const cpuModal = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

  return {
    totalStorage,
    cpuModal,
    totalMemoryGB,
  };
};

function getCpuUsage() {
  return new Promise((resolve) => osUtils.cpuUsage(resolve));
}
function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}
