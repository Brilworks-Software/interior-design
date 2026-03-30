import { useState, useEffect } from "react";
import { referralService } from "../../services/referral.service";
import { Copy, Check, Users, TrendingUp, LogIn, Share2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner";

export default function AffiliatePanel() {
  const [affiliate, setAffiliate] = useState(null);
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadAffiliateData();
  }, []);

  const loadAffiliateData = async () => {
    setLoading(true);
    try {
      const data = await referralService.getAffiliateInfo();
      setAffiliate(data.affiliate);
      setStats(data.stats);
      setReferrals(data.referrals || []);
    } catch (err) {
      const message = err.message === "Request failed with status code 404"
        ? "You are not yet an affiliate. Become one to start earning rewards!"
        : err.message || "Failed to load affiliate data";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeAffiliate = async () => {
    setIsCreating(true);
    try {
      const data = await referralService.becomeAffiliate();
      setAffiliate(data.affiliate);
      setStats({ total_referrals: 0, completed_signups: 0, total_logins: 0 });
      setReferrals([]);
      toast.success("Welcome to the affiliate program! 🎉");
    } catch (err) {
      const message = err.message || "Failed to become affiliate";
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async () => {
    if (affiliate?.referral_url) {
      try {
        await navigator.clipboard.writeText(affiliate.referral_url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleShareLink = () => {
    if (!affiliate?.referral_url) return;

    if (navigator.share) {
      navigator
        .share({
          title: "Join the Interior Design Community",
          text: "Earn rewards by referring your friends to our interior design app!",
          url: affiliate.referral_url,
        })
        .catch(() => toast.error("Failed to share link"));
    } else {
      handleCopyLink();
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Not yet affiliate - CTA to join
  if (!affiliate) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="rounded-full bg-primary/10 p-4 w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Become an Affiliate
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Earn rewards by referring friends to our interior design app. Start building your affiliate network today!
            </p>
            <Button
              onClick={handleBecomeAffiliate}
              disabled={isCreating}
              size="lg"
              className="w-full"
            >
              {isCreating ? "Creating..." : "Join the Affiliate Program"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affiliate dashboard
  return (
    <div className="space-y-6">
      {/* Referral Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={affiliate.referral_url}
              className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground font-mono truncate"
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button
              onClick={handleShareLink}
              size="sm"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Share this link with friends to earn rewards when they sign up!
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Referrals
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums text-foreground">
                {stats.total_referrals}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Signups
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums text-foreground">
                {stats.completed_signups}
              </p>
              {stats.total_referrals > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((stats.completed_signups / stats.total_referrals) * 100)}% conversion
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Logins
              </CardTitle>
              <LogIn className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tabular-nums text-foreground">
                {stats.total_logins}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty referrals state */}
      {referrals.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No referrals yet. Start sharing your link to earn rewards!
          </AlertDescription>
        </Alert>
      )}

      {/* Referrals list */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{ref.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(ref.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    ref.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ref.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

//       {/* Referrals Table */}
//       {referrals.length > 0 && (
//         <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Your Referrals ({referrals.length})
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                     Referred User ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                     Referred Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                     Signup Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                     Logins
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                     Last Login
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {referrals.map((referral) => (
//                   <tr
//                     key={referral.id}
//                     className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="px-6 py-4 text-sm text-gray-700 font-mono">
//                       {referral.referred_user_id.substring(0, 8)}...
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {new Date(referral.referred_at).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {referral.signup_at
//                         ? new Date(referral.signup_at).toLocaleDateString()
//                         : "—"}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
//                         {referral.login_count}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {referral.last_login_at
//                         ? new Date(referral.last_login_at).toLocaleDateString()
//                         : "—"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {referrals.length === 0 && (
//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
//           <p className="text-gray-600">
//             No referrals yet. Share your link to get started!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
