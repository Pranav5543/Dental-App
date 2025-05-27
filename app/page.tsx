import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Stethoscope,
  Users,
  Calendar,
  FileText,
  Shield,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              OnlyFix HealthCare
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/patient/login"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Patient Portal
            </Link>
            <Link
              href="/dentist/login"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dentist Portal
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/patient/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/patient/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Dental Care
            <span className="block text-blue-600">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with qualified dentists, schedule checkups, and manage your
            dental health with our comprehensive digital platform. Get
            professional care with complete transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/patient/register">
              <Button size="lg" className="w-full sm:w-auto">
                Book Your Checkup
              </Button>
            </Link>
            <Link href="/dentist/register">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto hover:bg-transparent hover:text-inherit hover:border-inherit"
              >
                Join as Dentist
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose OnlyFix HealthCare?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Expert Dentists</CardTitle>
                <CardDescription>
                  Connect with qualified and experienced dental professionals in
                  your area
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Easy Scheduling</CardTitle>
                <CardDescription>
                  Book appointments and manage your dental checkups with just a
                  few clicks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Digital Records</CardTitle>
                <CardDescription>
                  Access your checkup results, images, and reports in PDF format
                  anytime
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Secure Platform</CardTitle>
                <CardDescription>
                  Your medical data is protected with enterprise-grade security
                  measures
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  Get instant notifications about your appointment status and
                  results
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Stethoscope className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Comprehensive Care</CardTitle>
                <CardDescription>
                  From routine checkups to specialized treatments, we've got you
                  covered
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Patients */}
            <div>
              <h4 className="text-2xl font-semibold text-blue-600 mb-6">
                For Patients
              </h4>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      Register & Login
                    </h5>
                    <p className="text-gray-600">
                      Create your account and access the patient portal
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      Choose a Dentist
                    </h5>
                    <p className="text-gray-600">
                      Browse available dentists and select your preferred
                      professional
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      Request Checkup
                    </h5>
                    <p className="text-gray-600">
                      Submit your checkup request and wait for confirmation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Get Results</h5>
                    <p className="text-gray-600">
                      View your checkup results and download PDF reports
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Dentists */}
            <div>
              <h4 className="text-2xl font-semibold text-green-600 mb-6">
                For Dentists
              </h4>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      Join the Platform
                    </h5>
                    <p className="text-gray-600">
                      Register as a dentist and set up your professional profile
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      Manage Requests
                    </h5>
                    <p className="text-gray-600">
                      Review and accept patient checkup requests
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      Upload Results
                    </h5>
                    <p className="text-gray-600">
                      Upload checkup images and add professional notes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      Track Progress
                    </h5>
                    <p className="text-gray-600">
                      Monitor patient progress and maintain digital records
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of patients and dentists who trust OnlyFix HealthCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/patient/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Start as Patient
              </Button>
            </Link>
            <Link href="/dentist/register">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600"
              >
                Join as Dentist
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Stethoscope className="h-6 w-6" />
                <span className="text-xl font-bold">OnlyFix HealthCare</span>
              </div>
              <p className="text-gray-400">
                Modern dental care platform connecting patients with qualified
                professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Patients</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/patient/register"
                    className="hover:text-white transition-colors"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/patient/login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/patient/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Dentists</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/dentist/register"
                    className="hover:text-white transition-colors"
                  >
                    Join Platform
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dentist/login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dentist/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OnlyFix HealthCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
