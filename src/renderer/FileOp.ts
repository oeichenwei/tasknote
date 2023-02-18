import exp from 'constants';
import { FieldDataNode } from '../../tree/src/interface';

export type TreeDataType = FieldDataNode<{
  key: string;
  title: string;
  children?: TreeDataType[];
}>;

export type LoadFilesCB = (treeData: TreeDataType[], sel: string) => void;
export type ReadFileCB = (path: string, content: string) => void;

function loadFiles(cb: LoadFilesCB, sel: string) {
  window.electron.ipcRenderer.sendMessage('fs', ['ls', '']);
  window.electron.ipcRenderer.once('ls', (treeData) => {
    cb(treeData as TreeDataType[], sel);
  });
}

function makeDir(path: string, cb: LoadFilesCB) {
  window.electron.ipcRenderer.sendMessage('fs', ['mkdir', path]);
  window.electron.ipcRenderer.once('mkdir', (err, resPath) => {
    console.log('mkdir result:', resPath, err);
    if (!err) {
      loadFiles(cb, resPath as string);
    }
  });
}

function makeFile(path: string, cb: LoadFilesCB) {
  window.electron.ipcRenderer.sendMessage('fs', ['writefile', path]);
  window.electron.ipcRenderer.once('writefile', (err) => {
    if (err) {
      console.error('writefile result:', err);
      return;
    }
    loadFiles(cb, path);
  });
}

function writeFile(path: string, data: string) {
  window.electron.ipcRenderer.sendMessage('fs', ['writefile', path, data]);
}

function readFile(path: string, cb: ReadFileCB) {
  window.electron.ipcRenderer.sendMessage('fs', ['readfile', path]);
  window.electron.ipcRenderer.once('readfile', (err, content, id) => {
    if (err) {
      console.error('readfile result:', err);
      return;
    }
    cb(id as string, content as string);
  });
}

export { loadFiles, writeFile, makeDir, makeFile, readFile };
