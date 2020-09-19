import { chain, Rule } from '@angular-devkit/schematics';
import { updatePackagesInPackageJson } from '@nrwl/workspace';
import * as path from 'path';

export default function update(): Rule {
  return chain([
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    updatePackagesInPackageJson(
      path.join(__dirname, '../../../', 'migrations.json'),
      '0.6.0'
    ),
  ]);
}
