import { join } from 'path';
import { schema } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';

import { MockBuilderContext } from '@nrwl/workspace/testing';

const testRunner = new SchematicTestRunner(
  '@bananajs-nx-stuff/nxelectron',
  join(__dirname, '../../collection.json')
);

export function runSchematic(schematicName: string, options: any, tree: Tree) {
  return testRunner.runSchematicAsync(schematicName, options, tree).toPromise();
}

export function callRule(rule: Rule, tree: Tree): Promise<Tree> {
  return testRunner.callRule(rule, tree).toPromise();
}

export async function getTestArchitect() {
  const architectHost = new TestingArchitectHost('/root', '/root');
  const registry = new schema.CoreSchemaRegistry();
  registry.addPostTransform(schema.transforms.addUndefinedDefaults);

  const architect = new Architect(architectHost, registry);

  await architectHost.addBuilderFromPackage(join(__dirname, '../..'));

  return [architect, architectHost] as [Architect, TestingArchitectHost];
}

export async function getMockContext() {
  const [architect, architectHost] = await getTestArchitect();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const context = new MockBuilderContext(architect, architectHost);
  await context.addBuilderFromPackage(join(__dirname, '../..'));

  return context;
}
