import { tags } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { VuexSchematicSchema } from './schema';

describe('vuex schematic', () => {
  let appTree: Tree;
  const options: VuexSchematicSchema = { project: 'my-app', skipFormat: false };

  const testRunner = new SchematicTestRunner(
    '@bananajs/nxvue',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(async () => {
    appTree = createEmptyWorkspace(Tree.empty());
    appTree = await testRunner
      .runSchematicAsync('app', { name: 'my-app' }, appTree)
      .toPromise();
  });

  it('should generate Vuex configuration', async () => {
    const tree = await testRunner
      .runSchematicAsync('vuex', options, appTree)
      .toPromise();

    const packageJson = readJsonInTree(tree, 'package.json');
    expect(packageJson.dependencies['vuex']).toBeDefined();

    expect(tree.exists('apps/my-app/src/store/index.ts')).toBeTruthy();

    const main = tree.readContent('apps/my-app/src/main.ts');
    expect(main).toContain("import store from './store';");
    expect(main).toContain(tags.stripIndent`
      new Vue({
        store,
        render: (h) => h(App),
      }).$mount('#app');
    `);
  });
});
