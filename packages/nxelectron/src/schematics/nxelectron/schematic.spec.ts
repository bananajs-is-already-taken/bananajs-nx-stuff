import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { NxelectronSchematicSchema } from './schema';

describe('nxelectron schematic', () => {
  let appTree: Tree;
  const options: NxelectronSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@stract2-libs/nxelectron',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('nxelectron', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
