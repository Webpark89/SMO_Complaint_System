#!/bin/bash
# Filename: fix-imports.sh
# Usage: bash fix-imports.sh
# Purpose: Update import statements for all renamed files in src/, with backup

BASE_DIR=$(pwd)
SRC_DIR="$BASE_DIR/src"

echo "📦 Starting import fixes in $SRC_DIR ..."

# Function: Backup a file
backup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        cp "$file" "$file.bak"
    fi
}

# 1️⃣ super-admin → admin
find $SRC_DIR -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    backup_file "$file"
    sed -i '' 's|@/components/super-admin/|@/components/admin/|g' "$file"
done

# 2️⃣ hooks
find $SRC_DIR -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    backup_file "$file"
    sed -i '' 's|@/hooks/use-auth|@/hooks/useAuth|g' "$file"
    sed -i '' 's|@/hooks/use-mobile|@/hooks/useDevice|g' "$file"
done

# 3️⃣ CMS components
find $SRC_DIR -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    backup_file "$file"
    sed -i '' 's|@/components/cms/PageShell|@/components/cms/PageContainer|g' "$file"
    sed -i '' 's|@/components/cms/MainLayout|@/components/cms/CMSLayout|g' "$file"
    sed -i '' 's|@/components/cms/SiteHeader|@/components/cms/Header|g' "$file"
    sed -i '' 's|@/components/cms/SiteFooter|@/components/cms/Footer|g' "$file"
done

# 4️⃣ Complaints pages
find $SRC_DIR -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    backup_file "$file"
    sed -i '' 's|ComplaintListPage|ComplaintsPage|g' "$file"
    sed -i '' 's|ComplaintIntakePage|IntakePage|g' "$file"
    sed -i '' 's|ComplaintAssignmentPage|AssignmentPage|g' "$file"
    sed -i '' 's|ComplaintInvestigationPage|InvestigationPage|g' "$file"
    sed -i '' 's|ComplaintApprovalPage|ApprovalPage|g' "$file"
    sed -i '' 's|ComplaintExtensionPage|ExtensionsPage|g' "$file"
    sed -i '' 's|SensitiveCasePage|SensitiveComplaintsPage|g' "$file"
    sed -i '' 's|DocumentEvidencePage|DocumentsPage|g' "$file"
    sed -i '' 's|AdminDashboard|DashboardPage|g' "$file"
done

# 5️⃣ Mock files
find $SRC_DIR -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    backup_file "$file"
    sed -i '' 's|./complaints.mock|./ComplaintsMock|g' "$file"
    sed -i '' 's|./approval.mock|./ApprovalMock|g' "$file"
    sed -i '' 's|./users.mock|./UsersMock|g' "$file"
    sed -i '' 's|./audit-logs.mock|./AuditLogsMock|g' "$file"
    sed -i '' 's|./organizations.mock|./OrganizationsMock|g' "$file"
done

# 6️⃣ Services
find $SRC_DIR -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    backup_file "$file"
    sed -i '' 's|@/services/complaints|@/services/ComplaintService|g' "$file"
    sed -i '' 's|anonymousSession|AnonymousSessionService|g' "$file"
    sed -i '' 's|routeGuards|RouteGuardService|g' "$file"
done

# 7️⃣ AdminLayout → AdminLayout
find $SRC_DIR -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    backup_file "$file"
    sed -i '' 's|AdminLayout|AdminLayout|g' "$file"
done

# 8️⃣ UI components (revert to lowercase to match files)
find $SRC_DIR -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    backup_file "$file"
    sed -i '' 's|@/components/ui/Button|@/components/ui/button|g' "$file"
    sed -i '' 's|@/components/ui/Table|@/components/ui/table|g' "$file"
    sed -i '' 's|@/components/ui/AlertDialog|@/components/ui/alert-dialog|g' "$file"
    sed -i '' 's|@/components/ui/Accordion|@/components/ui/accordion|g' "$file"
    sed -i '' 's|@/components/ui/Alert|@/components/ui/alert|g' "$file"
done

echo "✅ All import statements have been updated. Backup of each file is stored as *.bak"