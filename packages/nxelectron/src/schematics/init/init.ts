import { Rule, chain } from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  updateJsonInTree,
  addPackageWithInit,
  updateWorkspace,
  formatFiles,
} from '@nrwl/workspace';
import { Schema } from './schema';
import {
  nxElectronVersion,
  electronVersion,
  electronPackagerVersion,
  electronBuilderVersion,
  rimrafVersion,
  exitZeroVersion,
} from '../../utils/versions';
import { JsonObject } from '@angular-devkit/core';

function addDependencies(): Rule {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return addDepsToPackageJson(
    {},
    {
      '@bananajs-nx-stuff/nxelectron': nxElectronVersion,
      electron: electronVersion,
      exitzero: exitZeroVersion,
      // 'electron-packager': electronPackagerVersion,
      // 'electron-builder': electronBuilderVersion,
      // 'rimraf': rimrafVersion
    }
  );
}

function moveDependency(): Rule {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return updateJsonInTree('package.json', (json) => {
    json.dependencies = json.dependencies || {};

    delete json.dependencies['@bananajs-nx-stuff/nxelectron'];
    delete json.dependencies['electron'];
    // delete json.dependencies['electron-packager'];
    // delete json.dependencies['electron-builder'];
    // delete json.dependencies['rimraf'];

    return json;
  });
}

function addScripts(): Rule {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return updateJsonInTree('package.json', (json) => {
    json.scripts = json.scripts || {};

    json.scripts['postinstall'] = 'exitzero electron-builder install-app-deps';

    return json;
  });
}

function setDefault(): Rule {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return updateWorkspace((workspace) => {
    workspace.extensions.cli = workspace.extensions.cli || {};

    const defaultCollection: string =
      workspace.extensions.cli &&
      ((workspace.extensions.cli as JsonObject).defaultCollection as string);

    if (!defaultCollection || defaultCollection === '@nrwl/workspace') {
      (workspace.extensions.cli as JsonObject).defaultCollection =
        '@bananajs-nx-stuff/nxelectron';
    }
  });
}

export default function (schema: Schema) {
  return chain([
    setDefault(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignores
    addPackageWithInit('@nrwl/jest'),
    addScripts(),
    addDependencies(),
    moveDependency(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    formatFiles(schema),
  ]);
}
