import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Copy, Share2, Mail, MessageCircle, Users, Gift, ArrowLeft, Check, Facebook, Twitter, Send, Share2Icon } from "lucide-react"
import { AppLayout } from "@/components/AppLayout"
import useReferralStore from "@/store/referralStore"

export const ReferralPage = () => {
  const [copied, setCopied] = useState(false)
  const [emailForm, setEmailForm] = useState({
    email: "",
    message: "",
  })
  const [showEmailForm, setShowEmailForm] = useState(false)

  const { referralStats, referralCode, getReferralStats} = useReferralStore();

  const referralLink = `https://tiklog.com/signup?ref=${referralCode}` //replace the number with the code retrieved from the store

  const defaultMessage = `🎉 Join me on TikLog - the best delivery platform! Use my referral code ${referralCode} and we both get amazing rewards. Sign up now: ${referralLink}`

  useEffect(() => {
    getReferralStats()
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(defaultMessage)
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const shareViaFacebook = () => {
    const url = encodeURIComponent(referralLink)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(defaultMessage)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      await sendEmailInvitation({
        email: emailForm.email,
        message: emailForm.message || defaultMessage,
        referralCode,
      })
      setEmailForm({ email: "", message: "" })
      setShowEmailForm(false)
      // Show success message
    } catch (error) {
      console.error("Failed to send email:", error)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join TikLog",
          text: defaultMessage,
          url: referralLink,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <AppLayout title="Share and Invite" icon={<Share2Icon />}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <Gift className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <div className="text-2xl font-bold text-gray-900">₦{referralStats?.totalCommissionPaid || 0}</div>
                <p className="text-sm text-gray-600">Total commission paid out</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <div className="text-2xl font-bold text-gray-900">{referralStats?.totalReferrals || 0}</div>
                <p className="text-sm text-gray-600">Total referrals</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Referral Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">Share code with your friends.</h2>

              {/* Referral Code Display */}
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-1">Your Referral Code</div>
                <div className="text-xl font-mono font-bold text-gray-900 mb-3">{referralCode || "Loading..."}</div>
                <Button onClick={copyToClipboard} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      COPY LINK
                    </>
                  )}
                </Button>
              </div>

              {/* Social Sharing Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={shareViaWhatsApp}
                    className="flex items-center justify-center bg-transparent"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                    WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleNativeShare}
                    className="flex items-center justify-center bg-transparent"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={shareViaFacebook}
                    className="flex items-center justify-center bg-transparent"
                  >
                    <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                    Facebook
                  </Button>

                  <Button
                    variant="outline"
                    onClick={shareViaTwitter}
                    className="flex items-center justify-center bg-transparent"
                  >
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                    Twitter
                  </Button>
                </div>

                <Button variant="outline" onClick={() => setShowEmailForm(!showEmailForm)} className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email Invitation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Form */}
          {showEmailForm && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Send Email Invitation</h3>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Friend's Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="friend@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Custom Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={emailForm.message}
                      onChange={(e) => setEmailForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder={defaultMessage}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowEmailForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Benefits Section */}
          {/* <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Referral Benefits</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">You Get ₦500</h4>
                    <p className="text-sm text-gray-600">Earn ₦500 credit for each successful referral</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Your Friend Gets ₦300</h4>
                    <p className="text-sm text-gray-600">They receive ₦300 credit upon successful signup</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* How It Works */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">How it works</h3>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>The code you share will be valid for 30 days on TikLog</p>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Your promo code is valid for 30 days on TikLog platform</p>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Make some new friends, get some good deliveries</p>
                </div>
              </div>

              <Separator className="my-4" />

              <p className="text-xs text-gray-500 text-center">T&C applies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export default ReferralPage
