import type { QwikVitePlugin, QwikManifest } from '@builder.io/qwik/optimizer';
import type { BuildContext, BuildRoute } from '../types';
import { isModuleExt, isPageExt, removeExtension } from '../../utils/fs';
import { getImportPath } from './utils';

export function createRoutes(
  ctx: BuildContext,
  qwikPlugin: QwikVitePlugin,
  c: string[],
  esmImports: string[]
) {
  const isSsr = ctx.target === 'ssr';
  const includeEndpoints = isSsr;
  const dynamicImports = ctx.target === 'client';

  if (ctx.layouts.length > 0) {
    c.push(`\n/** Qwik City Layouts (${ctx.layouts.length}) */`);
    for (const layout of ctx.layouts) {
      const importPath = JSON.stringify(getImportPath(layout.filePath));
      if (dynamicImports) {
        c.push(`const ${layout.id} = ()=>import(${importPath});`);
      } else {
        esmImports.push(`import * as ${layout.id}_ from ${importPath};`);
        c.push(`const ${layout.id} = ()=>${layout.id}_;`);
      }
    }
  }

  c.push(`\n/** Qwik City Routes (${ctx.routes.length}) */`);
  c.push(`export const routes = [`);

  for (const route of ctx.routes) {
    const loaders = [];

    if (isPageExt(route.ext)) {
      // page module or markdown
      for (const layout of route.layouts) {
        loaders.push(layout.id);
      }

      const importPath = getImportPath(route.filePath);
      if (dynamicImports) {
        loaders.push(`()=>import(${JSON.stringify(importPath)})`);
      } else {
        esmImports.push(`import * as ${route.id} from ${JSON.stringify(importPath)};`);
        loaders.push(`()=>${route.id}`);
      }
    } else if (includeEndpoints && isModuleExt(route.ext)) {
      // include endpoints, and this is a module
      const importPath = getImportPath(route.filePath);
      esmImports.push(`import * as ${route.id} from ${JSON.stringify(importPath)};`);
      for (const layout of route.layouts) {
        loaders.push(layout.id);
      }
      loaders.push(`()=>${route.id}`);
    }

    if (loaders.length > 0) {
      c.push(`  ${createRouteData(qwikPlugin, route, loaders, isSsr)},`);
    }
  }

  c.push(`];`);
}

function createRouteData(
  qwikPlugin: QwikVitePlugin,
  r: BuildRoute,
  loaders: string[],
  isSsr: boolean
) {
  const pattern = r.pattern.toString();
  const moduleLoaders = `[ ${loaders.join(', ')} ]`;

  // Use RouteData interface

  if (isSsr) {
    const paramNames =
      r.paramNames && r.paramNames.length > 0 ? JSON.stringify(r.paramNames) : `undefined`;
    const originalPathname = JSON.stringify(r.pathname);
    const clientBundleNames = JSON.stringify(getClientRouteBundleNames(qwikPlugin, r));

    // SSR also adds the originalPathname and clientBundleNames to the RouteData
    return `[ ${pattern}, ${moduleLoaders}, ${paramNames}, ${originalPathname}, ${clientBundleNames} ]`;
  }

  if (r.paramNames.length > 0) {
    // only add the params to the RouteData if there are any
    const paramNames = JSON.stringify(r.paramNames);
    return `[ ${pattern}, ${moduleLoaders}, ${paramNames} ]`;
  }

  // simple RouteData, only pattern regex and module loaders
  return `[ ${pattern}, ${moduleLoaders} ]`;
}

function getClientRouteBundleNames(qwikPlugin: QwikVitePlugin, r: BuildRoute) {
  const bundlesNames: string[] = [];

  // TODO: Remove globalThis that was previously used. Left in for backwards compatibility.
  const manifest: QwikManifest = (globalThis as any).QWIK_MANIFEST || qwikPlugin.api.getManifest();
  if (manifest) {
    const manifestBundleNames = Object.keys(manifest.bundles);

    const addRouteFile = (filePath: string) => {
      filePath = removeExtension(filePath);

      for (const bundleName of manifestBundleNames) {
        const bundle = manifest.bundles[bundleName];
        if (bundle.origins) {
          for (const bundleOrigin of bundle.origins) {
            const originPath = removeExtension(bundleOrigin);
            if (filePath.endsWith(originPath)) {
              if (!bundlesNames.includes(bundleName)) {
                bundlesNames.push(bundleName);
              }
            }
          }
        }
      }
    };

    for (const layout of r.layouts) {
      addRouteFile(layout.filePath);
    }
    addRouteFile(r.filePath);
  }

  return bundlesNames;
}
