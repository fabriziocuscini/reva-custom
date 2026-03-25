figma.showUI(__html__, { width: 480, height: 560, themeColors: true });

var SCOPE_MAP = {
  colors: ["ALL_FILLS", "STROKE_COLOR", "EFFECT_COLOR"],
  spacing: ["GAP"],
  sizes: ["WIDTH_HEIGHT"],
  containerSizes: ["WIDTH_HEIGHT"],
  breakpoints: ["WIDTH_HEIGHT"],
  radii: ["CORNER_RADIUS"],
  borderWidths: ["STROKE_FLOAT"],
  blurs: ["EFFECT_FLOAT"],
  opacity: ["OPACITY"],
  fonts: ["FONT_FAMILY"],
  fontSizes: ["FONT_SIZE"],
  fontWeights: ["FONT_WEIGHT"],
  lineHeights: ["LINE_HEIGHT"],
  letterSpacings: ["LETTER_SPACING"],
  durations: [],
  zIndex: [],
};

function getScopes(name) {
  var g = name.split("/")[0];
  return SCOPE_MAP[g] || [];
}

function log(msg) {
  figma.ui.postMessage({ type: "log", message: msg });
}

function progress(current, total, collection) {
  figma.ui.postMessage({
    type: "progress",
    current: current,
    total: total,
    collection: collection,
  });
}

async function syncCollection(colConfig, varLookup) {
  var allCollections =
    await figma.variables.getLocalVariableCollectionsAsync();

  var col = allCollections.find(function (c) {
    return c.name === colConfig.name;
  });
  if (!col) {
    col = figma.variables.createVariableCollection(colConfig.name);
    log("  Created collection: " + colConfig.name);
  } else {
    log("  Found existing collection: " + colConfig.name);
  }

  var modeIds = [];
  for (var mi = 0; mi < colConfig.modes.length; mi++) {
    var modeName = colConfig.modes[mi];
    var mode = col.modes.find(function (m) {
      return m.name === modeName;
    });
    if (!mode) {
      if (
        mi === 0 &&
        col.modes.length === 1 &&
        colConfig.modes.indexOf(col.modes[0].name) === -1
      ) {
        col.renameMode(col.modes[0].modeId, modeName);
        mode = { modeId: col.modes[0].modeId, name: modeName };
        log("  Renamed default mode → " + modeName);
      } else {
        var newModeId = col.addMode(modeName);
        mode = { modeId: newModeId, name: modeName };
        log("  Added mode: " + modeName);
      }
    }
    modeIds.push(mode.modeId);
  }

  var existing = {};
  var allVars = await figma.variables.getLocalVariablesAsync();
  for (var vi = 0; vi < allVars.length; vi++) {
    if (allVars[vi].variableCollectionId === col.id) {
      existing[allVars[vi].name] = allVars[vi];
    }
  }

  var created = 0,
    updated = 0,
    deleted = 0,
    aliasErrors = 0;
  var variables = colConfig.variables;
  var manifestNames = {};
  for (var ni = 0; ni < variables.length; ni++) {
    manifestNames[variables[ni].name] = true;
  }

  for (var ei = 0; ei < variables.length; ei++) {
    var entry = variables[ei];
    var name = entry.name;
    var type = entry.type;

    var v = existing[name];
    if (!v) {
      v = figma.variables.createVariable(name, col, type);
      created++;
    } else {
      updated++;
    }

    var modeNames = colConfig.modes;
    for (var fi = 0; fi < modeNames.length; fi++) {
      var val = entry.values[modeNames[fi]];

      if (val && typeof val === "object" && val.alias) {
        var target = varLookup[val.alias];
        if (target) {
          v.setValueForMode(
            modeIds[fi],
            figma.variables.createVariableAlias(target),
          );
        } else {
          aliasErrors++;
        }
      } else if (val !== undefined) {
        v.setValueForMode(modeIds[fi], val);
      }
    }

    v.scopes = getScopes(name);
    v.setVariableCodeSyntax(
      "WEB",
      "var(--reva-" + name.replace(/\//g, "-") + ")",
    );
    if (entry.description) v.description = entry.description;

    varLookup[colConfig.name + "/" + name] = v;

    if ((ei + 1) % 50 === 0 || ei === variables.length - 1) {
      progress(ei + 1, variables.length, colConfig.name);
    }
  }

  var staleNames = Object.keys(existing).filter(function (n) {
    return !manifestNames[n];
  });
  for (var si = 0; si < staleNames.length; si++) {
    existing[staleNames[si]].remove();
    deleted++;
    log("  🗑 Deleted stale: " + staleNames[si]);
  }

  var msg =
    colConfig.name +
    ": " +
    created +
    " created, " +
    updated +
    " updated, " +
    deleted +
    " deleted (" +
    variables.length +
    " in manifest)";
  if (aliasErrors > 0) msg += " ⚠ " + aliasErrors + " unresolved alias(es)";
  return msg;
}

async function syncManifest(manifest) {
  log("Starting sync — " + manifest.collections.length + " collections");

  var varLookup = {};

  var allVars = await figma.variables.getLocalVariablesAsync();
  var allCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  var colById = {};
  for (var ci = 0; ci < allCollections.length; ci++) {
    colById[allCollections[ci].id] = allCollections[ci];
  }
  for (var vi = 0; vi < allVars.length; vi++) {
    var v = allVars[vi];
    var c = colById[v.variableCollectionId];
    if (c) varLookup[c.name + "/" + v.name] = v;
  }

  var results = [];
  for (var i = 0; i < manifest.collections.length; i++) {
    var colConfig = manifest.collections[i];
    log("\n▸ Syncing " + colConfig.name + " (" + colConfig.variables.length + " variables)…");
    var result = await syncCollection(colConfig, varLookup);
    results.push(result);
    log("  ✓ " + result);
  }

  var manifestColNames = {};
  for (var mci = 0; mci < manifest.collections.length; mci++) {
    manifestColNames[manifest.collections[mci].name] = true;
  }
  var freshCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  var deletedCols = 0;
  for (var dci = 0; dci < freshCollections.length; dci++) {
    if (!manifestColNames[freshCollections[dci].name]) {
      var colName = freshCollections[dci].name;
      freshCollections[dci].remove();
      deletedCols++;
      log("🗑 Deleted stale collection: " + colName);
    }
  }
  if (deletedCols > 0) {
    results.push(deletedCols + " stale collection(s) deleted");
  }

  log("\n──────────────────────────────");
  log("Sync complete!");
  for (var ri = 0; ri < results.length; ri++) {
    log("  " + results[ri]);
  }

  figma.ui.postMessage({ type: "done", results: results });
}

figma.ui.onmessage = function (msg) {
  if (msg.type === "sync") {
    syncManifest(msg.manifest).catch(function (err) {
      log("\n✗ Error: " + err.message);
      figma.ui.postMessage({ type: "error", message: err.message });
    });
  }
};
