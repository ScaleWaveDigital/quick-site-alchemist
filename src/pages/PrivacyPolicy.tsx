import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Privacy Policy</h1>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                Welcome to SiteGenie. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we handle your personal data when you use our website 
                builder platform and tell you about your privacy rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Information</h3>
                <p className="text-sm text-muted-foreground">
                  When you create an account, we collect your email address and any additional information 
                  you choose to provide.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Project Data</h3>
                <p className="text-sm text-muted-foreground">
                  We store the websites you create, including HTML, CSS, JavaScript, images, and any other 
                  content you add to your projects.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <p className="text-sm text-muted-foreground">
                  We collect information about how you use our service, including features accessed, 
                  projects created, and interactions with our AI assistant.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technical Data</h3>
                <p className="text-sm text-muted-foreground">
                  We automatically collect certain technical information including IP address, browser type, 
                  device information, and operating system.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  To provide, maintain, and improve our website builder platform and AI-powered features.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Account Management</h3>
                <p className="text-sm text-muted-foreground">
                  To manage your account, authenticate your identity, and provide customer support.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Communication</h3>
                <p className="text-sm text-muted-foreground">
                  To send you important updates about our service, new features, and respond to your inquiries.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Security and Fraud Prevention</h3>
                <p className="text-sm text-muted-foreground">
                  To protect our service and users from security threats, fraud, and abuse.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                Your data is stored securely using industry-standard encryption and security measures. 
                We use secure cloud infrastructure to ensure your projects and personal information are protected. 
                We implement appropriate technical and organizational measures to maintain the security of your data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sharing and Third Parties</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                We do not sell your personal data to third parties. We may share your information only in the 
                following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-4">
                <li>With service providers who help us operate our platform (hosting, analytics, AI services)</li>
                <li>When required by law or to protect our legal rights</li>
                <li>With your explicit consent</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Access and Portability</h3>
                <p className="text-sm text-muted-foreground">
                  You have the right to access your personal data and export your projects at any time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Correction and Deletion</h3>
                <p className="text-sm text-muted-foreground">
                  You can update your account information or request deletion of your data and account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Opt-Out</h3>
                <p className="text-sm text-muted-foreground">
                  You can opt out of non-essential communications at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                We use cookies and similar technologies to provide and improve our service. These help us 
                remember your preferences, authenticate your session, and analyze how you use our platform. 
                You can control cookie settings through your browser preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe your 
                child has provided us with personal information, please contact us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date. We encourage you 
                to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Email: privacy@sitegenie.com<br />
                Support: help@sitegenie.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
