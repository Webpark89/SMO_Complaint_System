/**
 * Update Import Paths Script
 * Scans all .ts and .tsx files and updates import statements to match renamed files
 *
 * Usage: node update-imports.js
 */

const fs = require("fs");
const path = require("path");

// ============ MAPPING CONFIGURATION ============
const IMPORT_MAPPINGS = [
  // Folder: super-admin → admin
  { from: "@/components/super-admin/", to: "@/components/admin/" },
  {
    from: "@/components/super-admin/constants/tableLabels",
    to: "@/components/admin/constants/TableLabels",
  },
  { from: "@/components/super-admin/crud", to: "@/components/admin/crud" },
  {
    from: "@/components/super-admin/layout/AdminLayout",
    to: "@/components/admin/layout/AdminLayout",
  },

  // Hooks
  { from: "@/hooks/use-auth", to: "@/hooks/useAuth" },
  { from: "@/hooks/use-mobile", to: "@/hooks/useDevice" },

  // CMS Components
  { from: "@/components/cms/PageShell", to: "@/components/cms/PageContainer" },
  { from: "@/components/cms/MainLayout", to: "@/components/cms/CMSLayout" },
  { from: "@/components/cms/SiteHeader", to: "@/components/cms/Header" },
  { from: "@/components/cms/SiteFooter", to: "@/components/cms/Footer" },
  {
    from: "@/components/cms/LanguageSwitch",
  },

  // UI Components (if renamed to PascalCase)
  { from: "@/components/ui/button", to: "@/components/ui/Button" },
  { from: "@/components/ui/table", to: "@/components/ui/Table" },
  { from: "@/components/ui/alert-dialog", to: "@/components/ui/AlertDialog" },
  { from: "@/components/ui/accordion", to: "@/components/ui/Accordion" },
  { from: "@/components/ui/alert", to: "@/components/ui/Alert" },

  // Mock files
  { from: "./complaints.mock", to: "./ComplaintsMock" },
  { from: "./approval.mock", to: "./ApprovalMock" },
  { from: "../complaints/approval.mock", to: "../complaints/ApprovalMock" },
  { from: "./users.mock", to: "./UsersMock" },
  { from: "./audit-logs.mock", to: "./AuditLogsMock" },
  { from: "./organizations.mock", to: "./OrganizationsMock" },

  // Route imports for super-admin pages
  {
    from: "@/components/super-admin/pages/complaints",
    to: "@/components/admin/pages/complaints",
  },
  {
    from: "@/components/super-admin/pages/dashboard",
    to: "@/components/admin/pages/DashboardPage",
  },
  {
    from: "@/components/super-admin/pages/settings",
    to: "@/components/admin/pages/settings",
  },
  {
    from: "@/components/super-admin/pages/reports",
    to: "@/components/admin/pages/reports",
  },
  {
    from: "@/components/super-admin/pages/organizations",
    to: "@/components/admin/pages/organizations",
  },
  {
    from: "@/components/super-admin/pages/workflows",
    to: "@/components/admin/pages/workflows",
  },
  {
    from: "@/components/super-admin/pages/users",
    to: "@/components/admin/pages/users",
  },
];

// ============ COMPONENT NAME MAPPINGS ============
const COMPONENT_MAPPINGS = [
  // AdminLayout → AdminLayout
  { from: "AdminLayout", to: "AdminLayout" },

  // Complaint Pages
  { from: "ComplaintListPage", to: "ComplaintsPage" },
  { from: "ComplaintIntakePage", to: "IntakePage" },
  { from: "ComplaintAssignmentPage", to: "AssignmentPage" },
  { from: "ComplaintInvestigationPage", to: "InvestigationPage" },
  { from: "ComplaintApprovalPage", to: "ApprovalPage" },
  { from: "ComplaintExtensionPage", to: "ExtensionsPage" },
  { from: "DocumentEvidencePage", to: "DocumentsPage" },
  { from: "SensitiveCasePage", to: "SensitiveComplaintsPage" },
  { from: "AdminDashboard", to: "DashboardPage" },

  // Report Pages
  { from: "ComplaintSummaryReportPage", to: "SummaryReportPage" },
  { from: "SLAPage", to: "SLASettingsPage" },
  { from: "AuditLogPage", to: "AuditReportPage" },
  { from: "ReportsPage", to: "ReportsPage" },
];

// ============ SCRIPT LOGIC ============
const SRC_DIR = path.join(__dirname, "src");
const BACKUP_DIR = path.join(__dirname, "backup_imports_" + Date.now());

let stats = {
  filesScanned: 0,
  filesModified: 0,
  totalReplacements: 0,
  changes: [],
};

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    log(`Created backup directory: ${BACKUP_DIR}`);
  }
}

function createBackup(filePath) {
  ensureBackupDir();
  const relativePath = path.relative(SRC_DIR, filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const backupDir = path.dirname(backupPath);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  fs.copyFileSync(filePath, backupPath);
}

function findFiles(dir, extensions = [".ts", ".tsx"]) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(SRC_DIR, fullPath);

      // Skip node_modules, backup dirs, and routeTree files
      if (
        entry.name === "node_modules" ||
        entry.name.startsWith("backup_") ||
        entry.name === "routeTree.gen.ts" ||
        fullPath.includes("node_modules")
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function processImports(content, filePath) {
  let modified = false;
  let lines = content.split("\n");
  let replacements = [];

  // Track imports to add (for mock file renames that need relative path adjustment)
  const newLines = [];
  const importChanges = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const originalLine = line;

    // Skip comments
    if (line.trim().startsWith("//") || line.trim().startsWith("/*")) {
      newLines.push(line);
      continue;
    }

    // 1. Replace import paths (string-based)
    for (const mapping of IMPORT_MAPPINGS) {
      if (line.includes(mapping.from)) {
        const newLine = line.replace(
          new RegExp(
            mapping.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
            "g",
          ),
          mapping.to,
        );
        if (newLine !== line) {
          line = newLine;
          replacements.push({ from: mapping.from, to: mapping.to });
          modified = true;
        }
      }
    }

    // 2. Replace component names in import statements and exports
    for (const mapping of COMPONENT_MAPPINGS) {
      // Match import statements like: import { AdminLayout } from "..."
      // or: import AdminLayout from "..."
      const importRegex = new RegExp(`\\b${mapping.from}\\b`, "g");
      if (line.match(importRegex)) {
        const newLine = line.replace(importRegex, mapping.to);
        if (newLine !== line) {
          replacements.push({ from: mapping.from, to: mapping.to });
          line = newLine;
          modified = true;
        }
      }
    }

    // 3. Handle exports from renamed pages (index.ts files)
    // Pattern: export { OldName } from "./OldName"
    for (const mapping of COMPONENT_MAPPINGS) {
      const exportRegex = new RegExp(
        `export\\s*\\{\\s*${mapping.from}\\s*\\}\\s*from\\s*['"\"]\\.\\/`,
        "g",
      );
      if (line.match(exportRegex)) {
        // Replace the export statement
        const newLine = line.replace(new RegExp(mapping.from, "g"), mapping.to);
        if (newLine !== line) {
          replacements.push({
            from: `export { ${mapping.from} }`,
            to: `export { ${mapping.to} }`,
          });
          line = newLine;
          modified = true;
        }
      }
    }

    newLines.push(line);
  }

  if (replacements.length > 0) {
    importChanges.push(...replacements);
  }

  return {
    content: modified ? newLines.join("\n") : null,
    replacements: importChanges,
  };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const result = processImports(content, filePath);

    if (result.content && result.replacements.length > 0) {
      // Create backup
      createBackup(filePath);

      // Write new content
      fs.writeFileSync(filePath, result.content, "utf8");

      // Log changes
      const relativePath = path.relative(SRC_DIR, filePath);
      stats.filesModified++;
      stats.totalReplacements += result.replacements.length;

      stats.changes.push({
        file: relativePath,
        replacements: result.replacements,
      });

      log(
        `✓ Modified: ${relativePath} (${result.replacements.length} replacements)`,
      );
    }

    stats.filesScanned++;
  } catch (error) {
    log(`✗ Error processing ${filePath}: ${error.message}`);
  }
}

function main() {
  log("===========================================");
  log("Import Update Script - Starting");
  log("===========================================");

  // Find all .ts and .tsx files
  const files = findFiles(SRC_DIR);
  log(`Found ${files.length} files to scan`);

  // Process each file
  for (const file of files) {
    processFile(file);
  }

  // Print summary
  log("\n===========================================");
  log("SUMMARY");
  log("===========================================");
  log(`Files scanned: ${stats.filesScanned}`);
  log(`Files modified: ${stats.filesModified}`);
  log(`Total replacements: ${stats.totalReplacements}`);
  log(`Backup location: ${BACKUP_DIR}`);

  if (stats.changes.length > 0) {
    log("\n--- Detailed Changes ---");
    for (const change of stats.changes) {
      log(`\n📄 ${change.file}`);
      for (const rep of change.replacements) {
        log(`   ${rep.from} → ${rep.to}`);
      }
    }
  } else {
    log("\nNo changes made.");
  }

  log("\n===========================================");
  log("Script completed");
  log("===========================================");
}

main();
