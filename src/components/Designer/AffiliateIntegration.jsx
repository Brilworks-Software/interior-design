import { useState } from "react";
import AffiliatePanel from "./AffiliatePanel";
import { Users } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";

/**
 * Example integration of AffiliatePanel into DesignerLayout
 * Shows how to add a tab/section to display affiliate dashboard
 */
export default function AffiliateIntegrationExample() {
  const [showAffiliatePanel, setShowAffiliatePanel] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Main Designer Area */}
      <div className="flex-1 bg-gray-900">
        {/* Your existing designer content */}
      </div>

      {/* Right Sidebar with Affiliate Panel */}
      <div className="w-96 bg-gray-50 border-l border-gray-200 shadow-lg">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setShowAffiliatePanel(false)}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              !showAffiliatePanel
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setShowAffiliatePanel(true)}
            className={`flex-1 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
              showAffiliatePanel
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users size={18} />
            Affiliate
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto h-[calc(100%-57px)] p-4">
          {showAffiliatePanel ? (
            <AffiliatePanel />
          ) : (
            <div className="text-gray-500 text-center py-8">
              Select properties panel...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Menu-based integration: button that opens a right-side sheet modal
 */
export function AffiliateMenuIntegration() {
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowAffiliateModal(true)}
        variant="ghost"
        className="gap-2"
      >
        <Users className="h-4 w-4" />
        Affiliate
      </Button>

      <Sheet open={showAffiliateModal} onOpenChange={setShowAffiliateModal}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Affiliate Dashboard</SheetTitle>
          </SheetHeader>
          <div className="mt-6 p-6">
            <AffiliatePanel />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/**
 * Page-based integration: dedicated affiliate dashboard page
 */
export function AffiliatePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Affiliate Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Earn rewards by referring your friends to our interior design app.
            Build your affiliate network and start earning today.
          </p>
        </div>

        <AffiliatePanel />
      </div>
    </div>
  );
}
